import { useState, useEffect } from "react";
import {
  useGetSettings, getGetSettingsQueryKey,
  useUpdateSettings, customFetch, MessageResponse,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<{
    siteName: string;
    siteEmail: string;
    siteUrl: string;
    currency: string;
    minDeposit: string;
    maxDeposit: string;
    minWithdrawal: string;
    maxWithdrawal: string;
    withdrawalFee: string;
    welcomeBonus: string;
    referralBonus: string;
    emailNotificationsEnabled: boolean;
    identityVerificationEnabled: boolean;
    walletConnectionRequired: boolean;
  }>({
    siteName: "", siteEmail: "", siteUrl: "", currency: "USD",
    minDeposit: "", maxDeposit: "",
    minWithdrawal: "", maxWithdrawal: "",
    withdrawalFee: "", welcomeBonus: "", referralBonus: "",
    emailNotificationsEnabled: false,
    identityVerificationEnabled: false,
    walletConnectionRequired: false,
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { data: settings, isLoading } = useGetSettings({
    query: { queryKey: getGetSettingsQueryKey() },
  });

  const updateMutation = useUpdateSettings();

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName ?? "",
        siteEmail: settings.siteEmail ?? "",
        siteUrl: settings.siteUrl ?? "",
        currency: settings.currency ?? "USD",
        minDeposit: String(settings.minDeposit ?? ""),
        maxDeposit: String(settings.maxDeposit ?? ""),
        minWithdrawal: String(settings.minWithdrawal ?? ""),
        maxWithdrawal: String(settings.maxWithdrawal ?? ""),
        withdrawalFee: String(settings.withdrawalFee ?? ""),
        welcomeBonus: String(settings.welcomeBonus ?? ""),
        referralBonus: String(settings.referralBonus ?? ""),
        emailNotificationsEnabled: settings.emailNotificationsEnabled ?? false,
        identityVerificationEnabled: settings.identityVerificationEnabled ?? false,
        walletConnectionRequired: settings.walletConnectionRequired ?? false,
      });
      setMaintenanceMode(settings.maintenanceMode ?? false);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await updateMutation.mutateAsync({
        data: {
          siteName: form.siteName,
          siteEmail: form.siteEmail,
          siteUrl: form.siteUrl || undefined,
          currency: form.currency,
          minDeposit: parseFloat(form.minDeposit) || undefined,
          maxDeposit: parseFloat(form.maxDeposit) || undefined,
          minWithdrawal: parseFloat(form.minWithdrawal) || undefined,
          maxWithdrawal: parseFloat(form.maxWithdrawal) || undefined,
          withdrawalFee: parseFloat(form.withdrawalFee) || undefined,
          maintenanceMode,
          emailNotificationsEnabled: form.emailNotificationsEnabled,
          identityVerificationEnabled: form.identityVerificationEnabled,
          walletConnectionRequired: form.walletConnectionRequired,
          welcomeBonus: parseFloat(form.welcomeBonus) || undefined,
          referralBonus: parseFloat(form.referralBonus) || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.error || err.message || "Save failed");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await customFetch<MessageResponse>(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.data?.error || err.message || "Password update failed");
    }
  };

  const field = (name: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={String(form[name])}
        onChange={handleChange}
        className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure platform-wide settings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            {/* Platform */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Platform</h2>
              <div className="space-y-4">
                {field("siteName", "Site Name")}
                {field("siteEmail", "Support Email", "email")}
                {field("siteUrl", "Site URL", "url")}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Deposit / Withdrawal Limits */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Deposit & Withdrawal Limits</h2>
              <div className="grid grid-cols-2 gap-4">
                {field("minDeposit", "Min Deposit ($)", "number")}
                {field("maxDeposit", "Max Deposit ($)", "number")}
                {field("minWithdrawal", "Min Withdrawal ($)", "number")}
                {field("maxWithdrawal", "Max Withdrawal ($)", "number")}
                {field("withdrawalFee", "Withdrawal Fee (%)", "number")}
              </div>
            </div>

            {/* Bonuses */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Bonuses</h2>
              <div className="grid grid-cols-2 gap-4">
                {field("welcomeBonus", "Welcome Bonus ($)", "number")}
                {field("referralBonus", "Referral Bonus ($)", "number")}
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Maintenance</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">
                      When enabled, users will see a maintenance page instead of the platform
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.emailNotificationsEnabled}
                    onChange={(e) => setForm((prev) => ({ ...prev, emailNotificationsEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Send email alerts to users after login, deposit, and withdrawal actions.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Requires backend SMTP configured with environment variables such as <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, and <code>SMTP_PASS</code>.
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.identityVerificationEnabled}
                    onChange={(e) => setForm((prev) => ({ ...prev, identityVerificationEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Identity Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Require users to verify their identity by uploading ID documents and optional selfies.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      When enabled, users will need to complete identity verification before certain actions are allowed.
                    </p>
                  </div>
                </label>                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.walletConnectionRequired}
                    onChange={(e) => setForm((prev) => ({ ...prev, walletConnectionRequired: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Require Wallet Connection</p>
                    <p className="text-xs text-muted-foreground">
                      Require users to connect at least one wallet before they can access certain features.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      When enabled, users must connect a wallet to access investment and trading features.
                    </p>
                  </div>
                </label>              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 w-full"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}


        {/* Password */}
          <br/><br/>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <form className="space-y-4">
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive-foreground">
                {error}
              </div>
            )}

            {/* Password */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Change Password</h2>
              {passwordSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400">
                  Password updated successfully.
                </div>
              )}
              {passwordError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive-foreground">
                  {passwordError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="w-full bg-secondary text-foreground rounded-lg py-3 text-sm font-semibold hover:opacity-90"
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
