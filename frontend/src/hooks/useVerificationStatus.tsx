import { useEffect, useState } from "react";
import fetchVerificationStatus from "@/lib/api-client/custom-fetch";

export const useVerificationStatus = (token: string | null) => {
  const [vstatus, setVstatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true; // prevents state update after unmount

    const getStatus = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchVerificationStatus(token);
        if (isMounted) {
          setVstatus(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getStatus();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return { vstatus, loading, error };
};