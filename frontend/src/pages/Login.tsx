import { useState } from "react";
import { Link, useLocation } from "wouter";
import {  useGetPublicSettings, useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Bitcoin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "./public/components/ThemeToggle";
import favicon from "../pages/public/assets/favicon.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [siteName, setSiteName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin();
  const { data: settings, isLoading } = useGetPublicSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await loginMutation.mutateAsync({ data: { email, password } });
      login(result.token, result.user as any);
      toast.success("Login successful");
      if ((result.user as any).role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      toast.error("Invalid email or password");
      setError(err?.data?.error || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="flex justify-between absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            {/* <Bitcoin className="w-6 h-6 text-primary-foreground" /> */}
            <img src={favicon} alt="Site logo" className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-[#1c1510] text-foreground"><Link to="/" className="capitalize text-[#1c1510] dark:text-[#fff]">{settings?.siteName?.toLocaleUpperCase()}</Link></span>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="text-xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to your trading account
          </p>

          {error && (
            <div className="bg-destructive/50 border border-destructive/20 rounded-lg px-4 py-3 mb-4 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <span>
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
