"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { LogIn, LogOut } from "lucide-react";

export default function AuthLinks() {
    const { user, isLoading } = useUser();

    const handleLogout = () => {
        localStorage.removeItem("customerSession");
        localStorage.removeItem("cart");
    };

    if (isLoading) return null;

    return (
        <div className="w-full mr-4 mt-4">
            {!user ? (
                <a
                    href="/api/auth/login?returnTo=/customer/dashboard"
                    className="block text-white font-semibold bg-default-700 px-4 py-2 rounded-md hover:bg-default-600 transition w-full text-center"
                >
                    <LogIn className="inline-block mr-2" />
                    Sign In
                </a>
            ) : (
                <a
                    href="/auth/logout"
                    onClick={handleLogout}
                    className="block bg-default-700 text-white font-semibold px-4 py-2 rounded-md hover:text-default-600 transition w-full text-center"
                >
                    <LogOut className="inline-block mr-2" />
                    Logout
                </a>
            )}
        </div>
    );
}
