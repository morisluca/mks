import { useState } from "react";
import { Link } from "wouter";
import { apiCall } from "@/lib/api-config";
import ThemeToggle from "./public/components/ThemeToggle";
import favicon from "./public/assets/favicon.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      await apiCall<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus("If that email is registered, a password reset link has been sent.");
    } catch (err: any) {
      setError(err?.message || "Unable to send reset email. Please try again.");
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
          <span className="text-2xl font-bold text-[#1c1510] dark:text-[#fff]">Forgot Password</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="text-xl font-bold text-foreground mb-2">Reset your password</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the email address associated with your account and we’ll send a reset link.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
