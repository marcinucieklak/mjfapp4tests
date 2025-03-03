import { createContext } from "react";
import { RegisterData, RegisterResponse, User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: RegisterData) => Promise<RegisterResponse>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
