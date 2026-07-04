import { useProgress } from "./useProgress";
import { useEffect, useState } from "react";

const SuccessCheck = () => {
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

export default function LoadingModal({ isOpen }: { isOpen: boolean }) {
  const { progress, message, complete } = useProgress(isOpen);
  const [done, setDone] = useState(false);

  // Simulate backend finishing
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      complete();     // jump to 100%
      setDone(true);  // trigger success UI
    }, 4000 + Math.random() * 2000);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Auto close or redirect
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        console.log("redirect...");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-xl p-8 max-w-md w-full">

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
}