import { useEffect, useState } from "react";

export function useProgress(isActive:any) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing...");

  useEffect(() => {
    if (!isActive) return;

    const steps = [
      { max: 15, text: "Creating account..." },
      { max: 35, text: "Validating details..." },
      { max: 65, text: "Processing data..." },
      { max: 85, text: "Verifying identity..." },
      { max: 95, text: "Finalizing..." },
    ];

    let current = 0;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;

        // Dynamic speed: fast → slow
        let increment;

        if (prev < 30) increment = Math.random() * 8;
        else if (prev < 60) increment = Math.random() * 5;
        else increment = Math.random() * 2;

        const next = Math.min(prev + increment, 95);

        // Update message
        const step = steps.find(s => next <= s.max);
        if (step) setMessage(step.text);

        return next;
      });
    }, 400 + Math.random() * 300); // irregular timing

    return () => clearInterval(interval);
  }, [isActive]);

  // Call this when real process finishes
  const complete = () => {
    setProgress(100);
    setMessage("Account created successfully!");
  };

  return { progress, message, complete };
}