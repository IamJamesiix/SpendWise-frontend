import React, { createContext, useContext, useCallback } from "react";
import { useAuthStore } from "../stores/authStore";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, setUser, clearUser } = useAuthStore();

  const login = useCallback(
    (userData) => {
      setUser(userData);
    },
    [setUser]
  );

  const logout = useCallback(() => {
    clearUser();
  }, [clearUser]);

  return (
<AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
