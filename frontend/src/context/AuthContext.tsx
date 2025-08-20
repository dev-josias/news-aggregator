import { createContext } from "react";
import type { User } from "../types";

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>(null);
