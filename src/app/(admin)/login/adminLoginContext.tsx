"use client";

<<<<<<< HEAD
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { IAdminLogin, IAdminSession } from "@/types";
=======
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { IAdminLogin } from "@/types";
>>>>>>> 33bd87087996e7cd4607bb7124386495be62ff1a

const APIURL = process.env.NEXT_PUBLIC_API_URL;

type IAdminSessionStorage = {
    token: string;
    payload: any;
};

interface IAuthContextProps {
<<<<<<< HEAD
  user: IAdminSession | null;
  setUser: (user: IAdminSession | null) => void;
  loginAdmin: (data: IAdminLogin) => Promise<void>;
  logoutAdmin: () => void;
  loading: boolean;
=======
    user: IAdminSessionStorage | null;
    setUser: (user: IAdminSessionStorage | null) => void;
    loginAdmin: (data: IAdminLogin) => Promise<void>;
    logoutAdmin: () => void;
>>>>>>> 33bd87087996e7cd4607bb7124386495be62ff1a
}

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

function parseJwt(token: string) {
<<<<<<< HEAD
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export const AdminLoginProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IAdminSession | null>(null);
  const [loading, setLoading] = useState(true);
=======
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        console.error("Error parsing JWT:", e);
        return null;
    }
}

export const AdminLoginProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IAdminSessionStorage | null>(null);
    const router = useRouter();
>>>>>>> 33bd87087996e7cd4607bb7124386495be62ff1a

  useEffect(() => {
    const storedUser = localStorage.getItem("adminSession");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

<<<<<<< HEAD
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

      const decodedToken = parseJwt(data.access_token);

      const session: IAdminSession = {
        token: data.access_token,
        payload: decodedToken,
      };

      setUser(session);
      localStorage.setItem("adminSession", JSON.stringify(session));
    } catch (error) {
      throw error;
    }
  };

  const logoutAdmin = () => {
    setUser(null);
    localStorage.removeItem("adminSession");
  };
=======
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

            const decodedToken = parseJwt(data.access_token);

            const sessionData: IAdminSessionStorage = {
                token: data.access_token,
                payload: decodedToken,
            };

            setUser(sessionData);
            localStorage.setItem("adminSession", JSON.stringify(sessionData));
            Cookies.set("adminSession", JSON.stringify(sessionData), {
                sameSite: "Strict",
                secure: true,
            });
        } catch (error) {
            throw error;
        }
    };

    const logoutAdmin = () => {
        setUser(null);
        localStorage.removeItem("adminSession");
        Cookies.remove("adminSession");
        localStorage.removeItem("userSession");
        // localStorage.removeItem("pendingRestaurant");
        localStorage.removeItem("cart");
        router.push("/");
    };
>>>>>>> 33bd87087996e7cd4607bb7124386495be62ff1a

  return (
    <AuthContext.Provider
      value={{ user, setUser, loginAdmin, logoutAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
