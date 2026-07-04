import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken, setToken, removeToken } from "@/lib/auth";
import { getApiUrl } from "@/lib/api-config";

interface User {
  id: number;
  email: string;
  fullName: string;
  username: string;
  role: string;
  balance: number;
  bonusBalance: number;
  status: string;
  createdAt: string;
  // Verification fields (optional)
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  currency?: string | null;
  employmentStatus?: string | null;
  sourceOfIncome?: string | null;
  industry?: string | null;
  annualIncome?: string | null;
  estimatedNetWorth?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  provinceState?: string | null;
  postalZipCode?: string | null;
  phoneNumber?: string | null;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setTokenState(savedToken);
      // Fetch user from /api/auth/me to validate token
      const apiUrl = getApiUrl();
      fetch(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then((userData: User) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
          removeToken();
          setTokenState(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    queryClient.clear();
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
