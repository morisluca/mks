import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  useGetUser,
  useUpdateUser,
  useSuspendUser,
  useAddBonus,
  useDeleteUser,
  getListUsersQueryKey,
  getGetUserQueryKey,
  type UserWithStats,
} from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getToken } from "@/lib/auth";
import { apiCall } from "@/lib/api-config";
import { format } from "date-fns";
import { toast } from "sonner";

interface Message {
  id: number;
  title: string;
  body: string;
  sender: string;
  isRead: boolean;
  createdAt: string;
}

export default function UserDetails() {
  const [location, setLocation] = useLocation();
  const match = location.match(/\/admin\/users\/(\d+)$/);
  const userId = match ? Number(match[1]) : NaN;
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useGetUser(userId, {
    query: { enabled: !!userId, queryKey: getGetUserQueryKey(userId) },
  });

  const updateMutation = useUpdateUser();
  const suspendMutation = useSuspendUser();
  const bonusMutation = useAddBonus();
  const deleteMutation = useDeleteUser();

  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    balance: "", 
    status: "active",
    // Personal Info
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    // Financial Info
    currency: "",
    employmentStatus: "",
    sourceOfIncome: "",
    industry: "",
    annualIncome: "",
    estimatedNetWorth: "",
    // Address Info
    streetAddress: "",
    city: "",
    provinceState: "",
    postalZipCode: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [bonusAmount, setBonusAmount] = useState("");
  const [transactionType, setTransactionType] = useState("bonus");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageError, setMessageError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { data: messagesLog, isLoading: messagesLoading, refetch: refetchMessages } = useQuery<Message[], Error>({
    queryKey: ["adminMessagesLog", userId],
    queryFn: () => apiCall<Message[]>(`/api/admin/users/${userId}/messages-log`),
    enabled: !!userId,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        balance: String(user.balance),
        status: user.status,
        title: user.title || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        currency: user.currency || "",
        employmentStatus: user.employmentStatus || "",
        sourceOfIncome: user.sourceOfIncome || "",
        industry: user.industry || "",
        annualIncome: user.annualIncome || "",
        estimatedNetWorth: user.estimatedNetWorth || "",
        streetAddress: user.streetAddress || "",
        city: user.city || "",
        provinceState: user.provinceState || "",
        postalZipCode: user.postalZipCode || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);


  const invalidateUser = () => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError("");

    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: userId,
        data: {
          fullName: form.fullName,
          email: form.email,
          balance: parseFloat(form.balance),
          status: form.status,
          password: form.password ? form.password : undefined,
          title: form.title || undefined,
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
          currency: form.currency || undefined,
          employmentStatus: form.employmentStatus || undefined,
          sourceOfIncome: form.sourceOfIncome || undefined,
          industry: form.industry || undefined,
          annualIncome: form.annualIncome || undefined,
          estimatedNetWorth: form.estimatedNetWorth || undefined,
          streetAddress: form.streetAddress || undefined,
          city: form.city || undefined,
          provinceState: form.provinceState || undefined,
          postalZipCode: form.postalZipCode || undefined,
          phoneNumber: form.phoneNumber || undefined,
        },
      });
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      invalidateUser();
    } catch (err: any) {
      setError(err?.data?.error || "Unable to save user");
    }
  };

  const handleToggleStatus = async () => {
    if (!userId || !user) return;
    setError("");

    try {
      await suspendMutation.mutateAsync({
        id: userId,
        data: { status: user.status === "active" ? "suspended" : "active" },
      });
      invalidateUser();
    } catch (err: any) {
      setError(err?.data?.error || "Unable to update status");
    }
  };

  const handleAddBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError("");

    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/transactions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(bonusAmount),
          type: transactionType,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create transaction");
      }
      setBonusAmount("");
      invalidateUser();
      toast.success("Transaction created successfully");
    } catch (err: any) {
      setError(err.message || "Unable to create transaction");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setMessageError("");

    try {
      await apiCall<{ message: string }>(`/api/admin/users/${userId}/messages`, {
        method: "POST",
        body: JSON.stringify({ title: messageTitle, body: messageBody }),
      });
      setMessageTitle("");
      setMessageBody("");
      toast.success("Message sent successfully");
      await refetchMessages();
    } catch (err: any) {
      setMessageError(err.message || "Unable to send message");
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if(!confirm("Are you sure you want to delete this message? This action cannot be undone.")) return;
    if (!userId) return;
    setMessageError("");
    setDeletingId(messageId);

    try {
      await apiCall<{ message: string }>(`/api/admin/users/${userId}/messages/${messageId}`, {
        method: "DELETE",
      });
      toast.success("Message deleted successfully");
      await refetchMessages();
    } catch (err: any) {
      setMessageError(err.message || "Unable to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    if (!userId) return;
    setError("");

    try {
      await deleteMutation.mutateAsync({ id: userId });
      queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
      setLocation("/admin/users");
    } catch (err: any) {
      setError(err?.data?.error || "Unable to delete user");
    }
  };

  if (!userId) {
    return (
      <AdminLayout>
        <div className="p-6 bg-card border border-border rounded-xl">
          <p className="text-sm text-destructive-foreground">Invalid user ID.</p>
          <Link href="/admin/users" className="text-primary hover:underline mt-4 block">Back to users</Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">← Back to users</Link>
            <h1 className="text-2xl font-bold text-foreground mt-3">Manage User</h1>
            <p className="text-sm text-muted-foreground mt-1">Edit account details, suspend access, or delete this user.</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${user?.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {user?.status === "active" ? "Suspend user" : "Activate user"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete user"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading user...</div>
        ) : user ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <div className="space-y-3">              
                <div className="text-sm text-primary hover:underline">
                  <h3 className="text-2xl font-bold text-foreground mt-3 text-center">User Details</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.fullName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">${parseFloat(String(user.balance)).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bonus Balance</p>
                    <p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">${parseFloat(String(user.bonusBalance)).toFixed(2)}</p>
                  </div>
                </div>

                {/* Personal Info Display */}
                {(user.title || user.firstName || user.lastName || user.dateOfBirth) && (
                  <>
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Personal Information</p>
                      <div className="grid grid-cols-2 gap-3">
                        {user.title && <div><p className="text-xs text-muted-foreground">Title</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.title}</p></div>}
                        {user.firstName && <div><p className="text-xs text-muted-foreground">First Name</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.firstName}</p></div>}
                        {user.lastName && <div><p className="text-xs text-muted-foreground">Last Name</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.lastName}</p></div>}
                        {user.dateOfBirth && <div><p className="text-xs text-muted-foreground">DOB</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{format(new Date(user.dateOfBirth), "MMM d, yyyy")}</p></div>}
                      </div>
                    </div>
                  </>
                )}

                {/* Financial Info Display */}
                {(user.currency || user.employmentStatus || user.sourceOfIncome || user.industry || user.annualIncome || user.estimatedNetWorth) && (
                  <>
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Financial Information</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {user.currency && <div><p className="text-muted-foreground">Currency</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.currency}</p></div>}
                        {user.employmentStatus && <div><p className="text-muted-foreground">Employment</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.employmentStatus}</p></div>}
                        {user.sourceOfIncome && <div><p className="text-muted-foreground">Income Source</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.sourceOfIncome}</p></div>}
                        {user.industry && <div><p className="text-muted-foreground">Industry</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.industry}</p></div>}
                        {user.annualIncome && <div><p className="text-muted-foreground">Annual Income</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.annualIncome}</p></div>}
                        {user.estimatedNetWorth && <div><p className="text-muted-foreground">Net Worth</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.estimatedNetWorth}</p></div>}
                      </div>
                    </div>
                  </>
                )}

                {/* Address Info Display */}
                {(user.streetAddress || user.city || user.provinceState || user.postalZipCode || user.phoneNumber) && (
                  <>
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">Address Information</p>
                      <div className="space-y-2 text-xs">
                        {user.streetAddress && <div><p className="text-muted-foreground">Street</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.streetAddress}</p></div>}
                        <div className="grid grid-cols-3 gap-2">
                          {user.city && <div><p className="text-muted-foreground">City</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.city}</p></div>}
                          {user.provinceState && <div><p className="text-muted-foreground">State</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.provinceState}</p></div>}
                          {user.postalZipCode && <div><p className="text-muted-foreground">ZIP</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.postalZipCode}</p></div>}
                        </div>
                        {user.phoneNumber && <div><p className="text-muted-foreground">Phone</p><p className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{user.phoneNumber}</p></div>}
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="text-sm text-primary hover:underline">
                <h3 className="text-2xl font-bold text-foreground mt-3 text-center">Manage User Details</h3>
              </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Balance ($)</label>
                    <input
                      type="number"
                      value={form.balance}
                      onChange={(e) => setForm((prev) => ({ ...prev, balance: e.target.value }))}
                      min="0"
                      step="0.01"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                      <small className="text-red-500">Leave blank to keep current password</small>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                  {/* Personal Information Section */}
                  <div className="pt-6 border-t border-border">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                      <select
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="pt-6 border-t border-border">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Financial Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Currency</label>
                      <select
                        value={form.currency}
                        onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Employment Status</label>
                      <select
                        value={form.employmentStatus}
                        onChange={(e) => setForm((prev) => ({ ...prev, employmentStatus: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select status</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Retired">Retired</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Source of Income</label>
                      <select
                        value={form.sourceOfIncome}
                        onChange={(e) => setForm((prev) => ({ ...prev, sourceOfIncome: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                      <option value="">Select source</option>
                      <option value="Employment">Employment</option>
                      <option value="Investments">Investments</option>
                      <option value="Business">Business</option>
                      <option value="Savings">Savings</option>
                      <option value="Inheritance">Inheritance</option>

                      <option value="Freelancing">Freelancing</option>
                      <option value="Side Hustle">Side Hustle</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Pension">Pension</option>
                      <option value="Rental Income">Rental Income</option>
                      <option value="Dividends">Dividends</option>
                      <option value="Interest Income">Interest Income</option>
                      <option value="Royalties">Royalties</option>
                      <option value="Government Benefits">Government Benefits</option>
                      <option value="Scholarships">Scholarships</option>
                      <option value="Grants">Grants</option>
                      <option value="Crowdfunding">Crowdfunding</option>
                      <option value="Sale of Assets">Sale of Assets</option>
                      <option value="Crypto Earnings">Crypto Earnings</option>
                      <option value="Farming/Agriculture">Farming/Agriculture</option>
                      <option value="Trading">Trading</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
                      <select
                        value={form.industry}
                        onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>

                      <option value="Education">Education</option>
                      <option value="Construction">Construction</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Energy">Energy</option>
                      <option value="Oil and Gas">Oil and Gas</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Tourism">Tourism</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Media">Media</option>
                      <option value="Advertising and Marketing">Advertising and Marketing</option>
                      <option value="Legal Services">Legal Services</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Nonprofit">Nonprofit</option>
                      <option value="Government">Government</option>
                      <option value="Aviation">Aviation</option>
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Mining">Mining</option>
                      <option value="Food and Beverage">Food and Beverage</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Annual Income</label>
                      <input
                        type="text"
                        value={form.annualIncome}
                        onChange={(e) => setForm((prev) => ({ ...prev, annualIncome: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="$100,000 - $250,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Estimated Net Worth</label>
                      <input
                        type="text"
                        value={form.estimatedNetWorth}
                        onChange={(e) => setForm((prev) => ({ ...prev, estimatedNetWorth: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="$500,000 - $1M"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="pt-6 border-t border-border">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Address Information</h2>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Street Address</label>
                      <input
                        type="text"
                        value={form.streetAddress}
                        onChange={(e) => setForm((prev) => ({ ...prev, streetAddress: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Province / State</label>
                        <input
                          type="text"
                          value={form.provinceState}
                          onChange={(e) => setForm((prev) => ({ ...prev, provinceState: e.target.value }))}
                          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Postal / Zip Code</label>
                        <input
                          type="text"
                          value={form.postalZipCode}
                          onChange={(e) => setForm((prev) => ({ ...prev, postalZipCode: e.target.value }))}
                          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phoneNumber}
                        onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full bg-accent text-accent-foreground rounded-lg py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 mt-6"
                >
                  {updateMutation.isPending ? "Saving..." : "Save all changes"}
                </button>
              </form>
            </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="text-sm text-primary hover:underline">
                <h3 className="text-2xl font-bold text-foreground mt-3 text-center">Create Transaction</h3>
              </div>
                <form onSubmit={handleAddBonus} className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Transaction Type</label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="bonus">Bonus</option>
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="debit">Debit</option>
                      <option value="profit">Profit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Amount ($)</label>
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="100.00"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={bonusMutation.isPending}
                    className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {bonusMutation.isPending ? "Creating..." : "Create Transaction"}
                  </button>
                </form>
              </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="text-sm text-primary hover:underline">
                <h3 className="text-2xl font-bold text-foreground mt-3 text-center">Send Message</h3>
              </div>
              <form onSubmit={handleSendMessage} className="space-y-4 pt-4 border-t border-border">
                {messageError && (
                  <div className="rounded-lg border border-destructive/80 bg-destructive/80 px-3 py-2 text-sm text-destructive-foreground">
                    {messageError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Message subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    rows={4}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Write a message to the user..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-sm font-semibold hover:opacity-90"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4 lg:col-span-full">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Message History</h2>
                <p className="text-sm text-muted-foreground mt-1">All messages sent to this user</p>
              </div>
              {messagesLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
              ) : !messagesLog || messagesLog.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No messages sent to this user yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messagesLog.map((message) => (
                    <div key={message.id} className={`rounded-lg border ${message.isRead ? "border-border" : "border-primary/30 bg-primary/5"} p-4`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{message.title}</p>
                            {!message.isRead && <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Unread</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">From {message.sender} • {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{message.body}</p>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={deletingId === message.id}
                          className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === message.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Quick stats</h2>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-xl font-semibold text-foreground">${parseFloat(String(user.totalInvested)).toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Total Deposited</p>
                  <p className="text-xl font-semibold text-foreground">${parseFloat(String(user.totalDeposited)).toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Total Investments</p>
                  <p className="text-xl font-semibold text-foreground">{user.activeInvestments}</p>
                </div>
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-xl font-semibold text-foreground">{format(new Date(user.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>



          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">User not found.</div>
        )}
      </div>
    </AdminLayout>
  );
}
