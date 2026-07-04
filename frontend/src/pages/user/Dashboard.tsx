import { useGetUserDashboard, getGetUserDashboardQueryKey, useGetPublicSettings, useListActiveWallets, getListActiveWalletsQueryKey, useCreateDeposit, useCreateWithdrawal } from "@workspace/api-client-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { TrendingUp, ArrowDownCircle, ArrowUpCircle, DollarSign, Activity, CheckCircle, Wallet, BarChart3, Plus, Minus, Repeat, ArrowRight, Bitcoin, ArrowLeft, X } from "lucide-react";
import { format } from "date-fns";
import { getToken } from "@/lib/auth";
import { customFetch, getNumberOfuserMessages } from "@/lib/api-client/custom-fetch";
import { useEffect, useState } from "react";
import Greeting from "@/components/ui/Greeting";
import { toast } from "sonner";
import { getRate } from "@/components/ui/fetchCoinRate";
import WalletQR from "@/components/ui/WalletQR";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { apiCall } from "@/lib/api-config";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border border-green-500/20",
    active: "bg-green-500/10 text-green-400 border border-green-500/20",
    completed: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function UserDashboard() {
  const { data, isLoading } = useGetUserDashboard({
    query: { queryKey: getGetUserDashboardQueryKey() },
  });
  
  const { data: settings } = useGetPublicSettings();
  const { data: wallets, isLoading: walletsLoading } = useListActiveWallets({
    query: { queryKey: getListActiveWalletsQueryKey() },
  });
  const depositMutation = useCreateDeposit();
  const withdrawMutation = useCreateWithdrawal();
  const [, setLocation] = useLocation();

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositStep, setDepositStep] = useState<1 | 2 | 3>(1);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositTxHash, setDepositTxHash] = useState("");
  const [depositReceipt, setDepositReceipt] = useState<File | null>(null);
  const [depositError, setDepositError] = useState("");
  const [depositSuccess, setDepositSuccess] = useState("");
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", currency: "", walletAddress: "" });
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200);
  const [rate, setRate] = useState(Number);

  const {token, user} = useAuth();
  const { vstatus, loading, error } = useVerificationStatus(token);


  
  const currencies = wallets || [];

  const selectedMethod = selectedWallet
    ? currencies.find((method) => method?.currency === selectedWallet.currency)
    : null;

  const currentRate = rate ?? 0;
  const formattedCryptoAmount = selectedWallet && depositAmount && currentRate
    ? (parseFloat(depositAmount) / currentRate).toFixed(8)
    : "0.00000000";

    
  // depositStep
  useEffect(() => {
    if (depositStep !== 3) {
      setTimeLeft(7200);
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [depositStep]);



  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWalletSelect = async (wallet: any) => {
    setSelectedWallet(wallet);
    const r = await getRate(wallet?.currency);
    setRate(r);
    setDepositStep(2);
    setDepositAmount("");
    setDepositTxHash("");
    setDepositReceipt(null);
    setDepositError("");
    setDepositSuccess("");
  };

  const handleContinueDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setDepositError("Enter a valid deposit amount.");
      return;
    }
    setDepositError("");
    setDepositStep(3);
  };

  const handleDepositReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositReceipt(e.target.files?.[0] ?? null);
  };

  const handleWithdrawChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setWithdrawForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetWithdrawForm = () => setWithdrawForm({ amount: "", currency: "", walletAddress: "" });

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");
    setWithdrawSuccess("");

    if (settings?.identityVerificationEnabled && vstatus !== "approved") {
      // Show loading state briefly before redirecting
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLocation("/dashboard/verificationretry");
      return;
    }

    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      setWithdrawError("Enter a valid withdrawal amount.");
      return;
    }

    if (!withdrawForm.currency || withdrawForm.currency === "select") {
      setWithdrawError("Select a withdrawal currency.");
      return;
    }

    if (!withdrawForm.walletAddress) {
      setWithdrawError("Enter your wallet address.");
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        data: {
          amount: parseFloat(withdrawForm.amount),
          currency: withdrawForm.currency,
          walletAddress: withdrawForm.walletAddress,
        },
      });

      setWithdrawSuccess(`Withdrawal request of ${settings?.currency}${withdrawForm.amount} submitted.`);
      resetWithdrawForm();
      setShowWithdrawModal(false);
      toast.success("Withdrawal request sent successfully!");
    } catch (err: any) {
      setWithdrawError(err?.data?.error || err.message || "Withdrawal failed");
    }
  };

  const handleConfirmDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError("");
    setDepositSuccess("");

    try {
      if (depositReceipt) {
        const formData = new FormData();
        formData.append("amount", depositAmount);
        formData.append("currency", selectedWallet.currency);
        formData.append("walletId", String(selectedWallet.id));
        if (depositTxHash) {
          formData.append("txHash", depositTxHash);
        }
        formData.append("receipt", depositReceipt);

        await customFetch(`${import.meta.env.VITE_API_URL}/api/transactions/deposit-receipt`, {
          method: "POST",
          body: formData,
        });
      } else {
        await depositMutation.mutateAsync({
          data: {
            amount: parseFloat(depositAmount),
            currency: selectedWallet.currency,
            walletId: selectedWallet.id,
            txHash: depositTxHash || undefined,
          },
        });
      }

      setDepositSuccess(`Your deposit of ${settings?.currency}${depositAmount} has been initiated.`);
      setDepositStep(1);
      setSelectedWallet(null);
      setDepositAmount("");
      setDepositTxHash("");
      setDepositReceipt(null);
      setShowDepositModal(false);
      toast.success("Deposit initiated successfully!");
      setLocation("/dashboard");
    } catch (err: any) {
      setDepositError(err?.data?.error || err.message || "Deposit failed");
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };


    useEffect(() => {
      const processExpiredInvestments = async () => {
        try {
          const token = getToken();
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND}/investments/complete-expired`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            // console.error("Failed to process expired investments:", data);
            return;
          }
          // console.log("Expired investments processed:", data);
        } catch (error) {
          // console.error("Failed to process expired investments:", error);
        }
      };
  
      processExpiredInvestments();
    }, []);
  

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </UserLayout>
    );
  }

  const stats = [
    { label: "Account Balance", value: `${settings?.currency} ${(data?.balance ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-primary" },
    { label: "Bonus Balance", value: `${settings?.currency} ${(data?.bonusBalance ?? 0).toFixed(2)}`, icon: TrendingUp, color: "text-accent" },
    { label: "Total Invested", value: `${settings?.currency} ${(data?.totalInvested ?? 0).toFixed(2)}`, icon: Activity, color: "text-chart-3" },
    { label: "Total Investments", value: String(data?.activeInvestments ?? 0), icon: CheckCircle, color: "text-chart-4" },
    { label: "Total Deposited", value: `${settings?.currency} ${(data?.totalDeposited ?? 0).toFixed(2)}`, icon: ArrowDownCircle, color: "text-chart-5" },
    { label: "Expected Returns", value: `${settings?.currency} ${(data?.totalReturns ?? 0).toFixed(2)}`, icon: ArrowUpCircle, color: "text-green-400" },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground"><Greeting /></h1>
              <p className="text-sm text-muted-foreground mt-1">Here's an overview of your portfolio and trading activity</p>
            </div>

            {settings?.walletConnectionRequired &&
              <div className="hover:shadow-lg hover:text-green-500 rounded-3xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground shadow-sm">
                <Link to="/dashboard/connect-wallet" className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span>Wallet Connect</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </Link>
              </div>
            }

          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="rounded-3xl border border-border bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-100/70">{settings?.siteName} Limited</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-100/70">{user?.fullName}</p>
                    <p className="mt-3 text-sm capitalize text-orange-100/80">{vstatus} Verification</p>
                  </div>
                  <div className="rounded-3xl bg-orange-600/30 px-3 py-2 text-xs uppercase tracking-[0.24em]">
                    Total balance
                  </div>
                </div>

                  <div className="mt-10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-3xl font-bold">{settings?.currency} {(data?.balance ?? 0).toFixed(2)}</p>
                      <p className="mt-2 text-sm text-orange-100/80">Total profit / bonus +{data?.balance ?? 0}%</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-right">
                      <p className="text-sm uppercase tracking-[0.22em] text-orange-100/80">Profit</p>
                      <p className="mt-2 text-1xl font-semibold">{settings?.currency} {(data?.totalReturns ?? 0).toFixed(2)}</p>
                      <p className="text-xs text-orange-100/70">Deposited</p>
                      <p className="mt-1 text-1xl font-semibold">{settings?.currency} {(data?.totalDeposited ?? 0).toFixed(2)}</p>
                    </div>
                  </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { label: "Deposit", icon: Plus, action: () => {
                      setShowDepositModal(true);
                      setShowWithdrawModal(false);
                      setDepositStep(1);
                      setSelectedWallet(null);
                      setDepositAmount("");
                      setDepositTxHash("");
                      setDepositReceipt(null);
                      setDepositError("");
                      setDepositSuccess("");
                    }
                  },
                  { label: "Withdraw", icon: Minus, action: () => {
                      setShowWithdrawModal(true);
                      setShowDepositModal(false);
                      resetWithdrawForm();
                      setWithdrawError("");
                      setWithdrawSuccess("");
                    }
                  },
                  // { label: "Transfer", icon: Repeat },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="inline-flex items-center gap-2 rounded-3xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-slate-50"
                    type="button"
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                ))}
                  <a href="/dashboard/transactions"
                    className="inline-flex items-center gap-2 rounded-3xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-slate-50">
                    <ArrowRight className="w-4 h-4" /> History
                  </a>
              </div>

            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">Go to live trading</h2>
                <p className="text-xs text-muted-foreground mt-1">Start copying trades from top traders now.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Asset allocation</p>
                    <p className="text-xs text-muted-foreground">Portfolio growth from total deposits</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Balance</span>
                    <span>{data?.balance ?? 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Deposits</span>
                    <span>{data?.totalDeposited ?? 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profits</span>
                    <span>{data?.totalReturns ?? 0}%</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="h-2 rounded-full bg-orange-500" />
                  <div className="h-2 rounded-full bg-red-500" />
                  <div className="h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div hidden className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Stats overview</p>
                    <p className="text-3xl font-bold text-foreground mt-3" hidden>{settings?.currency} {(data?.balance ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-3 py-2 text-sm text-muted-foreground">Live</div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-border bg-slate-50 p-4 text-center">
                    <p className="text-xs uppercase text-muted-foreground"> Investments</p>
                    <p className="mt-2 text-lg font-semibold">{settings?.currency} {(data?.completedInvestments ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-slate-50 p-4 text-center">
                    <p className="text-xs uppercase text-muted-foreground">Deposited</p>
                    <p className="mt-2 text-lg font-semibold">{settings?.currency} {(data?.totalDeposited ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-slate-50 p-4 text-center">
                    <p className="text-xs uppercase text-muted-foreground">ROI</p>
                    <p className="mt-2 text-lg font-semibold">{data?.totalReturns ?? 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Trade Copied</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <p className="text-sm">No trades yet</p>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-foreground">Following</p>
                <input
                  type="search"
                  placeholder="Search for trader"
                  className="mt-4 w-full rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>
        </div>

        {(data?.activeInvestmentList?.length ?? 0) > 0 && (
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Active Trades</h2>
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{data?.activeInvestmentList?.filter((inv) => inv.status === "active")?.length} active</span>
            </div>
            <div className="divide-y divide-border">
              {data?.activeInvestmentList?.filter((inv) => inv.status === "active")?.map((inv) => (
                <div key={inv.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{inv.planName}</p>
                    <p className=" text-xs text-muted-foreground mt-1">dur {inv.durationDays} days</p>
                  </div>
                  <div className="grid gap-2 text-right">
                    <p className="text-sm font-semibold text-foreground">{settings?.currency} {inv.amount.toFixed(2)}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Latest activity</span>
          </div>
          {(data?.recentTransactions?.length ?? 0) === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No transactions yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data?.recentTransactions?.reverse()?.map((tx) => (
                <div key={tx.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus" ? (
                      <ArrowDownCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowUpCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="grid gap-1 text-right">
                    <p className={`text-sm font-semibold ${tx.type === "deposit"  || tx.type === "profit" || tx.type === "bonus"? "text-green-400" : "text-red-400"}`}>
                      {tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>






      {/* deposit modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">

            <div className="flex max-h-[90vh] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-border bg-white px-6 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Choose Payment Method</p>
                  <h4 className="mt-3 text-sm capitalize font-bold text-foreground">Scroll and select your preferred payment method to deposit funds.</h4>
                </div>
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositStep(1);
                    setSelectedWallet(null);
                  }}
                  className="rounded-2xl border border-border bg-background p-3 text-muted-foreground hover:bg-secondary shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">

              {depositSuccess && (
                <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle className="inline-block h-4 w-4 align-middle" />
                  <span className="ml-2">{depositSuccess}</span>
                </div>
              )}

              {depositStep === 1 && (
                <div className="space-y-4 min-h-0">
                  {walletsLoading ? (
                    <div className="rounded-3xl border border-border bg-background p-6 text-center text-muted-foreground">Loading payment methods…</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {wallets?.map((wallet) => {
                        const method = currencies.find((item) => item.currency === wallet.currency);
                        return (
                          <div key={wallet.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-3xl ${method || "bg-slate-100"} shrink-0`}>
                                  {method ? (
                                    // <method.icon className={`h-6 w-6 ${method.color}`} />
                                    <span className="text-sm font-semibold">{wallet.currency}</span>
                                  ) : (
                                    <span className="text-sm font-semibold">{wallet.currency}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-lg font-semibold text-foreground truncate">{method?.currency ?? wallet.currency}</p>
                                  <p className="text-sm text-muted-foreground truncate">{method?.network ?? ""}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleWalletSelect(wallet)}
                                className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 shrink-0"
                              >
                                Deposit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {depositStep === 2 && selectedWallet && (
                <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="inline-flex items-center gap-2 rounded-3xl border border-border bg-slate-50 px-4 py-2 text-sm text-foreground hover:bg-slate-100"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="text-right text-sm text-muted-foreground">Step 2 of 3</div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="rounded-3xl border border-border bg-slate-50 p-5">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${selectedMethod ?? "bg-slate-100"} shrink-0`}>
                          {selectedMethod ? (
                            // <selectedMethod.icon className={`h-6 w-6 ${selectedMethod.color}`} />
                            <span className="text-sm font-semibold">{selectedWallet.currency}</span>
                          ) : (
                            <span className="text-sm font-semibold">{selectedWallet.currency}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold text-foreground truncate">{selectedWallet?.currency ?? selectedWallet.currency} <br/><span className="text-[#45bf58] text-sm"> {selectedWallet?.network ?? ""}</span></p>
                            {rate && <p className="text-sm text-muted-foreground mt-1">Rate: ${rate?.toFixed(6)} per unit</p>}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-slate-50 p-5">
                      <label className="text-sm font-semibold text-foreground">Amount ({settings?.currency})</label>
                      <div className="mt-3 rounded-3xl border border-border bg-white px-4 py-3">
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          min={settings?.minDeposit}
                          step="0.01"
                          className="w-full border-none bg-transparent p-0 text-2xl font-semibold text-foreground outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      {rate &&
                      <div className="mt-4 rounded-3xl border border-border bg-orange-50 px-4 py-3 text-sm text-orange-700">
                        <p>You will send</p>
                        <p className="mt-2 text-lg font-semibold break-all">{formattedCryptoAmount} {selectedWallet.currency}</p>
                      </div>
                      }
                    </div>
                  </div>

                  {depositError && (
                    <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {depositError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueDeposit}
                      className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {depositStep === 3 && selectedWallet && (
                <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">Complete Your Deposit</p>
                      <p className="text-sm text-muted-foreground">Confirm the details and send funds to the address below.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="rounded-2xl border border-border bg-slate-50 px-3 py-2 text-muted-foreground hover:bg-slate-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-3xl border border-border bg-orange-50 px-5 py-4 text-orange-700">
                    <p className="text-sm">Your deposit of {settings?.currency}{depositAmount} has been initiated.</p>
                    {rate && <p className="mt-2 text-base font-semibold">Please send {formattedCryptoAmount} {selectedWallet.currency} to the address below.</p>}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl hidden border border-border bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">1</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Check coin ticker</p>
                          <p className="text-xs text-muted-foreground">{selectedWallet.currency}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-border bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">2</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Check the total amount</p>
                          <p className="text-xs text-muted-foreground">≈ {settings?.currency}{depositAmount}</p>
                        </div>
                      </div>
                      {rate && 
                      <div className="mt-4 rounded-3xl border border-border bg-white p-4 text-sm text-foreground">
                        <p className="font-semibold">{formattedCryptoAmount} {selectedWallet.currency}</p>
                      </div>
                      }
                    </div>
                    <div className="rounded-3xl border border-border bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">3</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Send to this wallet address</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-3xl border border-border bg-white p-4">
                        <code className="flex-1 break-all text-sm text-foreground font-mono min-w-0">{selectedWallet.address}</code>
                        <button
                          type="button"
                          onClick={() => copyAddress(selectedWallet.address)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-200 shrink-0"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    {rate && 
                    <div className="rounded-3xl border border-border bg-white p-6 text-center shadow-sm">
                       <div className="mx-auto mb-4 h-40 w-40 flex items-center justify-center rounded-3xl border border-border bg-slate-50">
                        <WalletQR address={selectedWallet.address} /> 
                      </div>
                      <p className="text-sm text-muted-foreground">Scan to Pay</p>
                    </div>
                    }
                    <div className="rounded-3xl border border-border hidden bg-slate-50 p-5 text-center space-y-4">
                      <p className="text-sm text-muted-foreground ">Address valid for:</p>
                      <p className="text-2xl sm:text-3xl font-semibold text-foreground font-mono">{formatTime(timeLeft)}</p>
                      {rate &&
                      <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Important: Send exactly {formattedCryptoAmount} {selectedWallet.currency}.
                      </div>
                      }
                    </div>
                  </div>

                  <form onSubmit={handleConfirmDeposit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Transaction Hash (optional)</label>
                      <input
                        type="text"
                        value={depositTxHash}
                        onChange={(e) => setDepositTxHash(e.target.value)}
                        className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Deposit Receipt (optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDepositReceiptChange}
                        className="w-full text-sm text-foreground file:rounded-3xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                      />
                      {depositReceipt && (
                        <p className="mt-2 text-xs text-muted-foreground">Selected file: {depositReceipt.name}</p>
                      )}
                    </div>
                    {depositError && (
                      <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {depositError}
                      </div>
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={() => setDepositStep(2)}
                        className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={depositMutation.isPending}
                        className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                      >
                        Confirm Deposit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* withdraw modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">
            <div className="flex max-h-[90vh] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-border bg-white px-6 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Withdraw Funds</p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground">Request a withdrawal directly from your dashboard.</h2>
                </div>
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    resetWithdrawForm();
                  }}
                  className="rounded-2xl border border-border bg-background p-3 text-muted-foreground hover:bg-secondary shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
              {withdrawSuccess && (
                <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle className="inline-block h-4 w-4 align-middle" />
                  <span className="ml-2">{withdrawSuccess}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Amount ({settings?.currency})</label>
                    <input
                      name="amount"
                      type="number"
                      value={withdrawForm.amount}
                      onChange={handleWithdrawChange}
                      min={settings?.minWithdrawal}
                      step="0.01"
                      className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      placeholder="100.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Cryptocurrency</label>
                    <select
                      name="currency"
                      value={withdrawForm.currency}
                      onChange={handleWithdrawChange}
                      className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="select">Select currency</option>
                      {wallets?.map((wallet) => (
                        <option key={wallet.id} value={wallet.currency}>{wallet.currency} ({wallet.network})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Wallet Address</label>
                  <input
                    name="walletAddress"
                    type="text"
                    value={withdrawForm.walletAddress}
                    onChange={handleWithdrawChange}
                    className="w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="Enter your wallet address"
                  />
                </div>

                {withdrawError && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {withdrawError}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      resetWithdrawForm();
                    }}
                    className="rounded-3xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={withdrawMutation.isPending}
                    className="rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                  >
                    {withdrawMutation.isPending ? "Submitting..." : "Submit Withdrawal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      )}
    </UserLayout>
  );
}
