import { useEffect, useState } from "react";
import { useListActiveWallets, getListActiveWalletsQueryKey, useCreateWithdrawal, useGetPublicSettings } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/layout/UserLayout";
import { ArrowUpCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";



export default function Withdraw() {
  const { user, token } = useAuth();
  const [location, setLocation] = useLocation();
  const [form, setForm] = useState({ amount: "", currency: "", walletAddress: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [verificationState, setVerificationState] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const { data: settings } = useGetPublicSettings();

  const { data: wallets, isLoading } = useListActiveWallets({
    query: { queryKey: getListActiveWalletsQueryKey() },
  });

  const currencies = wallets || [];

  const withdrawMutation = useCreateWithdrawal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));


// Fetch verification status on mount
useEffect(() => {
  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verification`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        if(data?.status !== "approved"){
          setVerificationState(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch verification status:", error);
    }
  };
  
      if (user && token) {
        fetchVerificationStatus();
      }
    }, [user, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check verification status first
    if (settings?.identityVerificationEnabled && verificationState) {
      // Show loading state briefly before redirecting
      setVerificationLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setVerificationLoading(false);
      setLocation("/dashboard/verification");
      return;
    }

    setError("");
    setSuccess("");
    try {
      await withdrawMutation.mutateAsync({
        data: {
          amount: parseFloat(form.amount),
          currency: form.currency,
          walletAddress: form.walletAddress,
        },
      });
      setSuccess(`Withdrawal of $${form.amount} submitted. Awaiting admin approval.`);
      setForm({ amount: "", currency: "", walletAddress: "" });
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Withdrawal failed");
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdraw</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Request a withdrawal to your crypto wallet
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div>
            <span className="text-sm text-muted-foreground">Available Balance: </span>
            <span className="text-sm font-semibold text-accent">
              {settings?.currency} {parseFloat(String(user?.balance ?? 0)).toFixed(2)}
            </span>
          </div>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Amount ({settings?.currency})
              </label>
              <div className="relative">
                {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{settings?.currency + " "} </span> */}
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  min={settings?.minWithdrawal}
                  max={user?.balance ?? 0}
                  step="0.01"
                  className="w-full bg-input border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="    100.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Cryptocurrency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="select">select currency</option>
                {currencies.map((c) => (
                  <option key={c.currency} value={c.currency}>{c.currency} (Network: {c.network})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Your Wallet Address
              </label>
              <input
                name="walletAddress"
                type="text"
                value={form.walletAddress}
                onChange={handleChange}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your crypto wallet address"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Double-check this address. Withdrawals cannot be reversed.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-3 text-xs text-muted-foreground">
              Withdrawals are processed manually within 24-48 hours. The amount will be deducted from your balance upon approval.
            </div>

            <button
              type="submit"
              disabled={withdrawMutation.isPending || verificationLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <ArrowUpCircle className="w-4 h-4" />
              {withdrawMutation.isPending ? "Submitting..." : verificationLoading ? "Redirecting to verification..." : "Submit Withdrawal"}
              {(withdrawMutation.isPending || verificationLoading) && <Spinner className="w-4 h-4 text-primary-foreground animate-spin" />}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
