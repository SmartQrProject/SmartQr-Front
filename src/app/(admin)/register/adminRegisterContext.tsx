'use client';
import { IAdminRegister, IAdminSession } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export interface IRegisterContextProps {
    admin: IAdminSession | null;
    setAdmin: (admin: IAdminSession | null) => void;
    registerAdmin: (data: IAdminRegister)=>Promise<void>;
}

const AdminRegisterContext = createContext<IRegisterContextProps | undefined>(undefined);


export const AdminRegisterProvider = ({ children }: {children: ReactNode}) => {
    const [admin, setAdmin] = useState<IAdminSession | null>(null);

        useEffect(() => {
        const storedUser = localStorage.getItem("adminSession");
        if (storedUser) {
        setAdmin(JSON.parse(storedUser));
        }
    }, []);
    
    const registerAdmin = async (userData: IAdminRegister) => {
        try {
        const response = await fetch(`${APIURL}/restaurants/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
        const data = await response.json();
        if (!response.ok) throw new Error (data.message || "Registration Failed. Please, try again" )
        } catch (err) {
        throw err
        }
    }

    return (
        <AdminRegisterContext.Provider value={{ admin, setAdmin, registerAdmin }}>
        {children}
        </AdminRegisterContext.Provider>
    );
};

export const useAdminRegister = () => {
    const context = useContext(AdminRegisterContext);
    if (!context) {
        throw new Error("useAdminRegister must be used within an AdminRegisterProvider");
    }
    return context;
};
