import { useState } from "react";
import { Link } from "wouter";
import { apiCall } from "@/lib/api-config";
import ThemeToggle from "./public/components/ThemeToggle";
import favicon from "./public/assets/favicon.png";

export default function ResetPassword() {
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!token) {
      setError("Missing password reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiCall<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
      setStatus("Your password has been reset. You can now sign in.");
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.message || "Unable to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="flex justify-between absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src={favicon} alt="Site logo" className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-[#1c1510] dark:text-[#fff]">Reset Password</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="text-xl font-bold text-foreground mb-2">Create a new password</h1>
          <p className="text-sm text-muted-foreground mb-2">
            Enter a new password for your account. You will be able to sign in once the reset completes.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            This reset link expires in 60 minutes. If it has expired, request a new one.
          </p>

          {status && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-3 mb-4 text-sm text-secondary-foreground">
              {status}
            </div>
          )}
          {error && (
            <div className="bg-destructive/50 border border-destructive/20 rounded-lg px-4 py-3 mb-4 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm text-primary-foreground">
                Your password has been reset successfully.
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="New password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Resetting..." : "Reset password"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Remembered your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
