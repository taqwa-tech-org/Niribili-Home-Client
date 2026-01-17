import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  register: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Initialize from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // ✅ Login function
  const login = (authToken: string) => {
    localStorage.setItem("real Token", authToken);
    setToken(authToken);
    setIsAuthenticated(true);
    console.log("✅ Login successful");
  };

  // ✅ Register function
  const register = (authToken: string) => {
    localStorage.setItem("real Token", authToken);
    setToken(authToken);
    setIsAuthenticated(true);
    console.log("✅ Registration successful");
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("real Token");
    setToken(null);
    setIsAuthenticated(false);
    console.log("✅ User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};