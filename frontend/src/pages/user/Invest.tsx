import { useState } from "react";
import { useListPlans, getListPlansQueryKey, useCreateInvestment, getGetUserDashboardQueryKey, useGetPublicSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Clock, ArrowRight, X } from "lucide-react";

export default function Invest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { data: plans, isLoading } = useListPlans({
    query: { queryKey: getListPlansQueryKey() },
  });
  
  const { data: settings } = useGetPublicSettings();
  const investMutation = useCreateInvestment();

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await investMutation.mutateAsync({
        data: { planId: selectedPlan.id, amount: parseFloat(amount) },
      });
      setSuccess(`Successfully trading $${amount} in ${selectedPlan.name}!`);
      setSelectedPlan(null);
      setAmount("");
      queryClient.invalidateQueries({ queryKey: getGetUserDashboardQueryKey() });
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Trading failed");
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a plan that fits your trading goals
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-accent" />
          <div>
            <span className="text-sm text-muted-foreground">Available Balance: </span>
            <span className="text-sm font-semibold text-accent">
              {settings?.currency} {(user?.balance ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {plans?.map((plan) => (
              <div key={plan.id} className="bg-card border border-border rounded-xl p-5 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-primary hidden">{plan.roi}%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Duration</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{plan.durationDays} days</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">ROI</span>
                    </div>
                    <p className="hidden text-sm font-semibold text-primary">{plan.roi}%</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block mb-1">Min</span>
                    <p className="text-sm font-semibold text-foreground">{settings?.currency} {plan.minAmount.toFixed(0)}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block mb-1">Max</span>
                    <p className="text-sm font-semibold text-foreground">{settings?.currency} {plan.maxAmount.toFixed(0)}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedPlan(plan); setAmount(String(plan.minAmount)); setError(""); }}
                  className="mt-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Trade Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Investment modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Trade in {selectedPlan.name}</h2>
                <button onClick={() => setSelectedPlan(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-secondary rounded-lg p-4 mb-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground hidden">ROI</span>
                  <span className="text-primary font-semibold hidden">{selectedPlan.roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{selectedPlan.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount range</span>
                  <span className="text-foreground">${selectedPlan.minAmount} - ${selectedPlan.maxAmount}</span>
                </div>
                {amount && !isNaN(parseFloat(amount)) && (
                  <div className="flex hidden justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Expected return</span>
                    <span className="text-accent font-semibold">
                      ${(parseFloat(amount) * (1 + selectedPlan.roi / 100)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <form onSubmit={handleInvest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedPlan.minAmount}
                    max={Math.min(selectedPlan.maxAmount, user?.balance ?? 0)}
                    step="0.01"
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={investMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {investMutation.isPending ? "Processing..." : "Confirm Investment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
