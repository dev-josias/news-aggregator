import { useEffect, useState } from "react";
import type { User } from "../types";
import {
  login as apiLogin,
  register as apiRegister,
  me as apiMe,
  logout as apiLogout,
} from "../api/auth";
import AuthContext from "../context/AuthContext";
import { setAuthToken } from "../api/client";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    (async () => {
      try {
        if (token) setUser(await apiMe());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem("token", res.token);
    setAuthToken(res.token);
    setUser(res.data);
  };

  const register = async (n: string, e: string, p: string, pc: string) => {
    const res = await apiRegister(n, e, p, pc);
    localStorage.setItem("token", res.token);
    setAuthToken(res.token);
    setUser(res.data);
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem("token");
    setAuthToken(undefined);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
