import { createContext, type ReactNode, useState, useEffect } from "react";
import type {
  User,
  LoginRequest,
  LoginResponse,
  AuthStatus,
} from "@/types/auth.ts";
import { API_BASE_URL } from "@/lib/api.ts";

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

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: "include",
      });

      if (response.ok) {
        const data: AuthStatus = await response.json();
        if (data.authenticated && data.username) {
          setUser({ username: data.username });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth status check failed:", err);
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
      setUser({ username: data.username });
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
