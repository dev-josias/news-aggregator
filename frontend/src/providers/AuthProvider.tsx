import { useCallback, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ name: email.split("@")[0], email, id: 1 });
      setIsLoading(false);
    }, 1000);
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUser({ name, email, id: 1 });
        setIsLoading(false);
      }, 1000);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
