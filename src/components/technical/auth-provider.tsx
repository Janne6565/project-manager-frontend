import { createContext, type ReactNode, useState, useEffect } from "react";
import type { User, LoginRequest, LoginResponse } from "@/types/auth.ts";
import { API_BASE_URL } from "@/lib/api.ts";
import { clearAccessToken, setAccessToken } from "@/lib/auth-token.ts";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bootstrap the session from the httpOnly refresh cookie: POST /auth/token
  // mints a fresh access token (kept in memory) and returns the current user.
  // A 401 simply means "no valid refresh cookie" → signed out.
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        setAccessToken(data.token);
        setUser(data.user);
      } else {
        clearAccessToken();
        setUser(null);
      }
    } catch (err) {
      console.error("Auth bootstrap failed:", err);
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data: LoginResponse = await response.json();
      setAccessToken(data.token);
      setUser(data.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
