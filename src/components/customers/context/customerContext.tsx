"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

type ICustomerSessionStorage = {
  token: string;
  payload: any;
};

interface ICustomerLoginData {
  email: string;
  password: string;
}

interface ICustomerAuthContextProps {
  customer: ICustomerSessionStorage | null;
  setCustomer: (user: ICustomerSessionStorage | null) => void;
  loginCustomer: (data: ICustomerLoginData) => Promise<void>; // para login manual
  logoutCustomer: () => void;
}

const CustomerAuthContext = createContext<ICustomerAuthContextProps | undefined>(undefined);

// Sólo para decodificar JWT del login manual
function parseJwt(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<ICustomerSessionStorage | null>(null);
  const { user } = useUser();
  const router = useRouter();

  // Recupera sesión desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customerSession");
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
  }, []);

  // Manejo login con Auth0
  useEffect(() => {
    const handleAuth0Login = async () => {
      if (!user) return;

      try {
        const tokenRes = await getAccessToken();
        const token = tokenRes?.accessToken;

        if (!token) {
          console.warn("❌ No se obtuvo token de Auth0");
          return;
        }

        const sessionData: ICustomerSessionStorage = {
          token,
          payload: user,
        };

        setCustomer(sessionData);
        localStorage.setItem("customerSession", JSON.stringify(sessionData));
        Cookies.set("customerSession", JSON.stringify(sessionData), {
          sameSite: "Strict",
          secure: true,
        });

        console.log("✅ Sesión iniciada con Auth0");
      } catch (err) {
        console.error("❌ Error al obtener token de Auth0:", err);
      }
    };

    handleAuth0Login();
  }, [user]);

  // Manejo login manual (API propia)
  const loginCustomer = async (loginData: ICustomerLoginData) => {
    try {
      const response = await fetch(`${APIURL}/customers/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login manual fallido");
      }

      const decodedToken = parseJwt(data.access_token);

      const sessionData: ICustomerSessionStorage = {
        token: data.access_token,
        payload: decodedToken,
      };

      setCustomer(sessionData);
      localStorage.setItem("customerSession", JSON.stringify(sessionData));
      Cookies.set("customerSession", JSON.stringify(sessionData), {
        sameSite: "Strict",
        secure: true,
      });

      console.log("✅ Sesión iniciada con login manual");
    } catch (err) {
      console.error("❌ Error login manual:", err);
      throw err;
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("customerSession");
    Cookies.remove("customerSession");
    router.push("/auth/logout"); // Para cerrar sesión en Auth0 también
  };

  return (
    <CustomerAuthContext.Provider
      value={{ customer, setCustomer, loginCustomer, logoutCustomer }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth debe usarse dentro de CustomerAuthProvider");
  }
  return context;
};
