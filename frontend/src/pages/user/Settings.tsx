import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Shield } from "lucide-react";
import { useGetPublicSettings } from "@/lib/api-client/generated/api";
import { format } from "date-fns";

export default function Settings() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const { data: settings } = useGetPublicSettings();

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please fill out all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (!token) {
      setPasswordError("Unable to authenticate. Please sign in again.");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordSuccess(data.message || "Password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast({ title: "Success", description: "Password changed successfully." });
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (error) {
      setPasswordError("Unable to update password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6  w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account security</p>
        </div>

        {/* Profile card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">@{user?.username}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Security</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Change your password securely below. Enter your current password and choose a new one.
          </p>

          <div className="space-y-4">
            {passwordSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Confirm new password"
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="w-full"
            >
              {changingPassword ? "Updating password..." : "Change Password"}
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
