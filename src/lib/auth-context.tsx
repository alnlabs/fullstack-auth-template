"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "./auth";
import { ToastUtils, ToastMessages } from "./toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (
    emailOrUsername: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        ToastUtils.error(errorData.error || ToastMessages.auth.loginError);
        return false;
      }

      const data = await response.json();
      setUser(data.user);

      // Show success toast
      ToastUtils.success(ToastMessages.auth.loginSuccess);

      // Redirect based on user role
      if (data.user.role === "SUPERADMIN" || data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      ToastUtils.error(ToastMessages.auth.loginError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        ToastUtils.success(ToastMessages.auth.logoutSuccess);
      } else {
        ToastUtils.error(ToastMessages.auth.logoutError);
      }
    } catch (error) {
      console.error("Logout error:", error);
      ToastUtils.error(ToastMessages.auth.logoutError);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  }, [router]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUser,
  }), [user, loading, login, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
