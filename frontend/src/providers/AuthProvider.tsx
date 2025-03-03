import { useState, useEffect, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils";
import { AuthResponse, RegisterData, RegisterResponse, User } from "../types";
import { AuthContext } from "../context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.fetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { access_token, user } = response;

      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      throw new Error("Login failed");
    }
  };

  const signup = async (data: RegisterData) => {
    try {
      const response = await api.fetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      return response;
    } catch {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, token, user, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
