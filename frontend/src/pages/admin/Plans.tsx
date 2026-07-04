import { useState } from "react";
import {
  useAdminListPlans, getAdminListPlansQueryKey,
  useCreatePlan, useUpdatePlan, useDeletePlan,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface PlanForm {
  id?: number;
  name: string;
  description: string;
  roi: string;
  durationDays: string;
  minAmount: string;
  maxAmount: string;
  isActive: boolean;
}

const empty: PlanForm = {
  name: "", description: "", roi: "", durationDays: "",
  minAmount: "", maxAmount: "", isActive: true,
};

export default function Plans() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<PlanForm | null>(null);
  const [error, setError] = useState("");

  const { data: plans, isLoading } = useAdminListPlans({
    query: { queryKey: getAdminListPlansQueryKey() },
  });

  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const deleteMutation = useDeletePlan();

  const openNew = () => { setModal(empty); setError(""); };
  const openEdit = (plan: any) => {
    setModal({
      id: plan.id, name: plan.name, description: plan.description || "",
      roi: String(plan.roi), durationDays: String(plan.durationDays),
      minAmount: String(plan.minAmount), maxAmount: String(plan.maxAmount),
      isActive: plan.isActive,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setError("");
    const data = {
      name: modal.name, description: modal.description,
      roi: parseFloat(modal.roi), durationDays: parseInt(modal.durationDays),
      minAmount: parseFloat(modal.minAmount), maxAmount: parseFloat(modal.maxAmount),
      isActive: modal.isActive,
    };
    try {
      if (modal.id) {
        await updateMutation.mutateAsync({ id: modal.id, data });
      } else {
        await createMutation.mutateAsync({ data });
      }
      queryClient.invalidateQueries({ queryKey: getAdminListPlansQueryKey() });
      setModal(null);
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getAdminListPlansQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Investment Plans</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage investment plan tiers and ROI</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ROI</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Days</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Min</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Max</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {plans?.map((plan) => (
                    <tr key={plan.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-primary">{plan.roi}%</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">{plan.durationDays}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">${plan.minAmount}</td>
                      <td className="px-4 py-3 text-right text-sm text-foreground">${plan.maxAmount}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${plan.isActive ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(plan)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(plan.id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">{modal.id ? "Edit Plan" : "New Plan"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    value={modal.name}
                    onChange={(e) => setModal({ ...modal, name: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <input
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">ROI (%)</label>
                  <input
                    type="number" step="0.01"
                    value={modal.roi}
                    onChange={(e) => setModal({ ...modal, roi: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={modal.durationDays}
                    onChange={(e) => setModal({ ...modal, durationDays: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Amount ($)</label>
                  <input
                    type="number" step="0.01"
                    value={modal.minAmount}
                    onChange={(e) => setModal({ ...modal, minAmount: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Max Amount ($)</label>
                  <input
                    type="number" step="0.01"
                    value={modal.maxAmount}
                    onChange={(e) => setModal({ ...modal, maxAmount: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={modal.isActive}
                    onChange={(e) => setModal({ ...modal, isActive: e.target.checked })}
                    className="rounded border-border"
                  />
                  <label htmlFor="isActive" className="text-sm text-foreground">Active</label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {modal.id ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
