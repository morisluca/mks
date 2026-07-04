import { useState } from "react";
import { Link } from "wouter";
import {
  useListUsers, getListUsersQueryKey,
  useAddBonus, useDeleteUser, useSuspendUser,
  type User,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { Edit, Gift, X, Trash2 } from "lucide-react";

export default function Users() {
  const queryClient = useQueryClient();
  const [bonusUser, setBonusUser] = useState<any>(null);
  const [bonusAmount, setBonusAmount] = useState("");
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useListUsers({
    query: { queryKey: getListUsersQueryKey() },
  });

  const bonusMutation = useAddBonus();
  const deleteMutation = useDeleteUser();
  const suspendMutation = useSuspendUser();

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    try {
      await suspendMutation.mutateAsync({ id: user.id, data: { status: newStatus } });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    } catch (err: any) {
      alert(err?.data?.error || "Failed to update status");
    }
  };

  const handleAddBonus = async (e: React.FormEvent) => {
    if (!confirm("Are you sure you want to add the bonus?")) return;
    e.preventDefault();
    if (!bonusUser) return;
    setError("");
    try {
      await bonusMutation.mutateAsync({ id: bonusUser.id, data: { amount: parseFloat(bonusAmount) } });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      setBonusUser(null);
      setBonusAmount("");
    } catch (err: any) {
      setError(err?.data?.error || "Failed to add bonus");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteUser.id });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      setDeleteUser(null);
    } catch (err: any) {
      alert(err?.data?.error || "Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full md:grid-cols-1">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">UserID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">User</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Balance</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Bonus</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Joined</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users?.filter(user => user.role !== "admin" && (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())))?.map((user: User) => (
                    
                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-accent">${parseFloat(String(user.balance)).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-primary">${parseFloat(String(user.bonusBalance)).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`text-xs px-2 py-0.5 rounded-full capitalize cursor-pointer transition-opacity hover:opacity-70 ${user.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right flex justify-end items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
                          title="Manage user"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => { setBonusUser(user); setBonusAmount(""); setError(""); }}
                          className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-accent transition-colors"
                          title="Add bonus"
                        >
                          <Gift className="w-3.5 h-3.5" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setDeleteUser(user)}
                            className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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


      

      {/* Bonus modal */}
      {bonusUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Add Bonus</h2>
              <button onClick={() => setBonusUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Adding bonus to <span className="text-foreground font-medium">{bonusUser.fullName}</span>
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            <form onSubmit={handleAddBonus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Bonus Amount ($)</label>
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  min="0.01" step="0.01"
                  className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="100.00"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setBonusUser(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={bonusMutation.isPending}
                  className="flex-1 bg-accent text-accent-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {bonusMutation.isPending ? "Adding..." : "Add Bonus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Delete User</h2>
              <button onClick={() => setDeleteUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete <span className="text-foreground font-medium">{deleteUser.fullName}</span>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setDeleteUser(null)}
                className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteUser}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-destructive text-destructive-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
