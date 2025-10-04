import { Loading } from "@/components/ui/Loading";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { IUser } from "@/types/apiTypes";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
  authToken: string | null;
  user: IUser;
  login: (user: IUser, token?: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isCheckedUser: boolean;
  setIsCheckedUser: (isCheckedUser: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckedToken, setIsCheckedToken] = useState(false);
  const [isCheckedUser, setIsCheckedUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
    }
    setIsCheckedToken(true);
  }, []);
  const login = (user: IUser, token?: string) => {
    setUser(user);
    setIsAuthenticated(true);
    setIsAdmin(user.is_admin);
    if (token) {
      localStorage.setItem("auth_token", token);
      setAuthToken(token);
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null)
  };

  if (!isCheckedToken) {
    return <LoadingScreen />;
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        setIsAdmin,
        logout,
        authToken,
        user,
        login,
        loading,
        setLoading,
        isCheckedUser,
        setIsCheckedUser,
      }}
    >
      {loading && (
        <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <Loading />
        </div>
      )}
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
