import { useListMyTransactions, getListMyTransactionsQueryKey, useGetPublicSettings } from "@workspace/api-client-react";
import { UserLayout } from "@/components/layout/UserLayout";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
    completed: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };

  
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function Transactions() {
  const { data: transactions, isLoading } = useListMyTransactions({
    query: { queryKey: getListMyTransactionsQueryKey() },
  });
  
  const { data: settings } = useGetPublicSettings();
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">All your deposits and withdrawals</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (transactions?.length ?? 0) === 0 ? (
          <div className="bg-card border border-border rounded-xl px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Currency</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions?.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {tx.type === "deposit"  || tx.type === "profit" || tx.type === "bonus" ? (
                            <ArrowDownCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-sm font-medium text-foreground capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-semibold ${tx.type === "deposit"  || tx.type === "profit" || tx.type === "bonus"? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "deposit" || tx.type === "profit" || tx.type === "bonus" ? "+" : "-"}{settings?.currency} {parseFloat(String(tx.amount ?? 0)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{tx.currency}</td>
                      <td className="px-4 py-3 text-right"><StatusBadge status={tx.status} /></td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {format(new Date(tx.createdAt), "MMM d, yyyy")}
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
