import React, { createContext, useContext, useState, useEffect } from "react";
import { DatabaseAPI } from "../services/databaseApi";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("torchline_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const dbApi = new DatabaseAPI(email);
      const response = await dbApi.readData("users", undefined, 1, 0);
      
      if (response.success && response.data && response.data.length > 0) {
        const userData = response.data.find((u: any) => 
          u.data.email === email && u.data.password === password
        );
        
        if (userData) {
          const userInfo = {
            email: userData.data.email,
            name: userData.data.name,
            role: userData.data.role,
            company: userData.data.company
          };
          setUser(userInfo);
          setIsAuthenticated(true);
          localStorage.setItem("torchline_user", JSON.stringify(userInfo));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("torchline_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};