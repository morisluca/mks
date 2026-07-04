import {
  useAdminListInvestments, getAdminListInvestmentsQueryKey,
  useApproveInvestment, useRejectInvestment, useDeleteInvestment,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { getToken } from "@/lib/auth";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border border-green-500/20",
    active: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    completed: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function AdminInvestments() {
  const queryClient = useQueryClient();
  const [completeLoading, setCompleteLoading] = useState<number | null>(null);
  const { data: investments, isLoading } = useAdminListInvestments({
    query: { queryKey: getAdminListInvestmentsQueryKey() },
  });
  const approveMutation = useApproveInvestment();
  const rejectMutation = useRejectInvestment();
  const deleteMutation = useDeleteInvestment();

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListInvestmentsQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Failed to approve");
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject this investment?")) return;
    try {
      await rejectMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListInvestmentsQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Failed to reject");
    }
  };

  const handleCompleteNow = async (id: number) => {
    if (!confirm("Complete this investment and refund user (without profit)?")) return;
    setCompleteLoading(id);
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/investments/${id}/complete-now`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete investment");
      }
      queryClient.invalidateQueries({ queryKey: getAdminListInvestmentsQueryKey() });
      alert("Investment completed and user refunded");
    } catch (err: any) {
      alert(err.message || "Failed to complete investment");
    } finally {
      setCompleteLoading(null);
    }
  };

  const handleDeleteCompleted = async (id: number) => {
    if (!confirm("Delete this completed investment to save space?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListInvestmentsQueryKey() });
      alert("Completed investment deleted");
    } catch (err: any) {
      alert(err?.data?.error || err?.message || "Failed to delete completed investment");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investments</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and approve investment requests</p>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ROI</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Return</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {investments?.map((inv) => (
                    <tr key={inv.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{inv.userFullName}</p>
                        <p className="text-xs text-muted-foreground">{inv.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{inv.planName}</p>
                        <p className="text-xs text-muted-foreground">{inv.durationDays} days</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">${inv.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-primary">{inv.roi}%</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-accent">${inv.expectedReturn.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {format(new Date(inv.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inv.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(inv.id)}
                              className="p-1.5 hover:bg-green-500/10 rounded text-muted-foreground hover:text-green-400"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(inv.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-400"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {inv.status === "active" && (
                          <button
                            onClick={() => handleCompleteNow(inv.id)}
                            disabled={completeLoading === inv.id}
                            className="p-1.5 hover:bg-blue-500/10 rounded text-muted-foreground hover:text-blue-400 disabled:opacity-50"
                            title="Complete Now & Refund"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        {inv.status === "completed" && (
                          <button
                            onClick={() => handleDeleteCompleted(inv.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-400"
                            title="Delete completed investment"
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
