"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { IAdminLogin, IAdminSession } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface IAuthContextProps {
    user: IAdminSession | null;
    setUser: (user: IAdminSession | null) => void;
    loginAdmin: (data: IAdminLogin) => Promise<void>;
    logoutAdmin: () => void;
}

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export const AdminLoginProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IAdminSession | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("adminSession");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginAdmin = async (loginData: IAdminLogin) => {
        try {
          const response = await fetch(`${APIURL}/users/signin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(loginData),
          });

          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message || "Login failed");
          }

      setUser({token: data.access_token});
      localStorage.setItem("adminSession", JSON.stringify({token: data.access_token}));
    } catch (error) {
      throw error;
    }
  };

    const logoutAdmin = () => {
        setUser(null);
        localStorage.removeItem("adminSession");
    };

    return <AuthContext.Provider value={{ user, setUser, loginAdmin, logoutAdmin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
