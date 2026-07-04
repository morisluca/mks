import {
  useAdminListTransactions, getAdminListTransactionsQueryKey,
  useApproveTransaction, useRejectTransaction, useDeleteTransaction,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { CheckCircle, XCircle, ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function Transactions() {
  const queryClient = useQueryClient();
  const { data: transactions, isLoading } = useAdminListTransactions({
    query: { queryKey: getAdminListTransactionsQueryKey() },
  });
  const approveMutation = useApproveTransaction();
  const rejectMutation = useRejectTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleApprove = async (id: number) => {
    if (!confirm("Approve this transaction?")) return;
    try {
      await approveMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListTransactionsQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Failed to approve");
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject this transaction?")) return;
    try {
      await rejectMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListTransactionsQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Failed to reject");
    }
  };

  const handleDeleteCompleted = async (id: number) => {
    if (!confirm("Delete this completed withdrawal to save space?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListTransactionsQueryKey() });
      alert("Completed withdrawal deleted");
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to delete completed withdrawal");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Withdrawal Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Approve or reject deposits and withdrawals</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Currency</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Wallet</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions?.filter((t) => t.type === "withdrawal")?.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{tx.userFullName}</p>
                        <p className="text-xs text-muted-foreground">{tx.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {tx.type === "deposit" ? (
                            <ArrowDownCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-sm capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{tx.currency}</td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{tx.walletAddress}</td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={tx.status} /></td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {format(new Date(tx.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(tx.id)}
                              disabled={approveMutation.isPending}
                              className="p-1.5 hover:bg-green-500/10 rounded text-muted-foreground hover:text-green-400 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(tx.id)}
                              disabled={rejectMutation.isPending}
                              className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-400 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {tx.status === "approved" || tx.status === "rejected" && (
                          <button
                            onClick={() => handleDeleteCompleted(tx.id)}
                            className="p-1.5 hover:bg-red-500/90 rounded text-muted-foreground hover:text-red-400 transition-colors"
                            title="Delete completed withdrawal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
