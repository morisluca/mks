import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Greeting() {
  const [greeting, setGreeting] = useState("");
  const { user} = useAuth();``

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {greeting}, {user?.fullName || "Investor"}
    </>
  );
}