import { createContext } from "react";
import type { User } from "../types";

const AuthContext = createContext<{
  user?: User;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (n: string, e: string, p: string, pc: string) => Promise<void>;
  logout: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export default AuthContext;
