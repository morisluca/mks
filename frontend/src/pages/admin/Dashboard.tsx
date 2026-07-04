import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, TrendingUp, ArrowLeftRight, DollarSign, Activity, Clock, ArrowDownCircle, ArrowUpCircle, Shield } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    active: "bg-green-500/10 text-green-400",
    completed: "bg-blue-500/10 text-blue-400",
    rejected: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() },
  });

  const [pendingVerificationsCount, setPendingVerificationsCount] = useState<number>(0);

  useEffect(() => {
    const processExpiredInvestments = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND}/admin/investments/complete-expired`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          return;
        }
      } catch (error) {
        // ignore expired investments processing error
      }
    };

    const fetchPendingVerifications = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) return;
        const list = await resp.json();
        const pending = Array.isArray(list) ? list.filter((v: any) => v.status === "pending").length : 0;
        setPendingVerificationsCount(pending);
      } catch (err) {
        // ignore errors silently on dashboard
      }
    };

    processExpiredInvestments();
    fetchPendingVerifications();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  const pendingTotal = (data?.pendingDeposits ?? 0) + (data?.pendingWithdrawals ?? 0);
  const stats = [
    { label: "Total Users", value: String(data?.totalUsers ?? 0), icon: Users, color: "text-primary" },
    { label: "Active Users", value: String(data?.activeUsers ?? 0), icon: Users, color: "text-chart-4" },
    { label: "Active Investments", value: String(data?.activeInvestments ?? 0), icon: TrendingUp, color: "text-accent" },
    { label: "Pending Transactions", value: String(pendingTotal), icon: Clock, color: "text-yellow-400" },
    { label: "Pending Verifications", value: String(pendingVerificationsCount), icon: Shield, color: "text-pink-500" },
    { label: "Total Deposits", value: `$${(data?.totalDeposits ?? 0).toFixed(2)}`, icon: ArrowDownCircle, color: "text-chart-3" },
    { label: "Total Withdrawals", value: `$${(data?.totalWithdrawals ?? 0).toFixed(2)}`, icon: ArrowUpCircle, color: "text-chart-5" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform overview and statistics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Recent investments */}
          <div className="bg-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Recent Investments</h2>
            </div>
            <div className="divide-y divide-border max-h-80 overflow-x-auto">
              {(data?.recentInvestments?.length ?? 0) === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">No investments yet</div>
              ) : (
                data?.recentInvestments?.map((inv) => (
                  <div key={inv.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.userFullName}</p>
                      <p className="text-xs text-muted-foreground">{inv.planName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">${inv.amount.toFixed(2)}</p>
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-border max-h-80 overflow-x-auto">
              {(data?.recentTransactions?.length ?? 0) === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">No transactions yet</div>
              ) : (
                data?.recentTransactions?.map((tx) => (
                  <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">${tx.amount.toFixed(2)}</p>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
