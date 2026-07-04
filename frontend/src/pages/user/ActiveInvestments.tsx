import { useListMyInvestments, getListMyInvestmentsQueryKey, useGetPublicSettings } from "@workspace/api-client-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

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

export default function ActiveInvestments() {
  const { data: investments, isLoading } = useListMyInvestments({
    query: { queryKey: getListMyInvestmentsQueryKey() },
  });
  const { data: settings } = useGetPublicSettings();  

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Active Trades</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all your Trades positions</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (investments?.length ?? 0) === 0 ? (
          <div className="bg-card border border-border rounded-xl px-4 py-12 text-center">
            <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No Active investments yet. Start by choosing a plan.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {investments?.filter(i => i?.status === "active")?.map((inv) => (
                    <tr key={inv.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{inv.planName}</p>
                        <p className="text-xs text-muted-foreground">{inv.durationDays} days</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-foreground">{settings?.currency} {inv.amount.toFixed(2)}</td>
                    
                      <td className="px-4 py-3 capitalize text-right">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {format(new Date(inv.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
