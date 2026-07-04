import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRegister, getPublicSettings, useGetPublicSettings } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "./public/components/ThemeToggle";
import favicon from "../pages/public/assets/favicon.png";

function SuccessCheck() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-path"
          />
        </svg>
      </div>

      <p className="text-lg font-semibold text-foreground">
        Account Created
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Redirecting...
      </p>
    </div>
  );
}
// Progress Modal Component
const ProgressModal = ({
  progress,
  message,
  isOpen,
  done
}: {
  progress: number;
  message: string;
  isOpen: boolean;
  done: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card/80 fade-in backdrop-blur-xl border border-border/60 rounded-xl p-8 max-w-md w-full">

        {!done ? (
          <>
            <h2 className="text-lg font-semibold text-center mb-6">
              Creating Your Account
            </h2>

            <div className="relative w-full bg-border rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-primary">
                {Math.floor(progress)}%
              </span>
            </div>

            <p className="text-sm text-center text-muted-foreground animate-pulse">
              {message}
            </p>
          </>
        ) : (
          <SuccessCheck />
        )}

      </div>
    </div>
  );
};

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", fullName: "", username: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("Initializing...");
  const [showProgress, setShowProgress] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Password
  const [done, setDone] = useState(false);

  const registerMutation = useRegister();
  const { data: settings, isLoading } = useGetPublicSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate step 1 fields
    if (!form.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email");
      return;
    }
    
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  // Animated progress function
const animateProgress = () => {
  return new Promise((resolve) => {
    const steps = [
      { max: 15, text: "Creating account..." },
      { max: 35, text: "Validating details..." },
      { max: 65, text: "Processing data..." },
      { max: 85, text: "Verifying identity..." },
      { max: 95, text: "Finalizing..." },
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          resolve(true); // ✅ now await works
          return prev;
        }

        let increment;
        if (prev < 30) increment = Math.random() * 8;
        else if (prev < 60) increment = Math.random() * 5;
        else increment = Math.random() * 2;

        const next = Math.min(prev + increment, 95);

        const step = steps.find(s => next <= s.max);
        if (step) setProgressMessage(step.text);

        return next;
      });
    }, 400 + Math.random() * 300);
  });
};

    // Call this when real process finishes
  const complete = () => {
    setProgress(100);
    setProgressMessage("Account created successfully!");
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!form.confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setShowProgress(true);
    setProgress(0);
    setDone(false);

    try {
        // start fake loading
        const progressPromise = animateProgress();

      const result = await registerMutation.mutateAsync({ 
        data: {
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
        }
      });
      
      // wait until fake loading reaches ~95%
      await progressPromise;

      // complete
      setProgress(100);
      setProgressMessage("Account created successfully!");
      setDone(true); // ✅ triggers checkmark
      
      // Wait a moment before closing modal and redirecting
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setShowProgress(false);
      toast.success("Account created successfully!");

      // get site public settings
      const siteSettings = await getPublicSettings();
      
      if(siteSettings?.identityVerificationEnabled){
        login(result.token, result.user as any);      
        setLocation("/dashboard/verification");
      } else {
        setLocation("/login");
      }
    } catch (err: any) {
      setShowProgress(false);
      setError(err?.data?.error || err.message || "Registration failed");
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
            {/* <Bitcoin className="w-6 h-6 text-primary-foreground" /> */}
            <img src={favicon} alt="Site logo" className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-foreground capitalize"><Link to="/" className="capitalize text-[#1c1510] dark:text-[#fff]">{settings?.siteName?.toLocaleUpperCase()}</Link></span>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="d-flex flex-col items-center mb-8 text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-sm text-muted-foreground mb-6">Start your trading journey today</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 px-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
              }`}>
                {step > 1 ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : '1'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Basic Info</p>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-1 mx-2 mb-6">
              <div className={`h-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'
              }`}>
                2
              </div>
              <p className="text-xs text-muted-foreground mt-2">Password</p>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/50 border border-destructive/20 rounded-lg px-4 py-3 mb-4 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? handleContinue : handleSubmit} className="space-y-4">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                  <h2 className="text-lg font-semibold text-foreground mb-1">Set Your Password</h2>
                  <p className="text-sm text-muted-foreground">Create a strong password to secure your account</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-input border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-border text-foreground font-semibold py-2.5 px-4 rounded-lg hover:bg-border/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Progress Modal */}
      <ProgressModal progress={progress}  message={progressMessage} isOpen={showProgress} done={done} />
</div>
  );
}
