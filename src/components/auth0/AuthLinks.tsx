"use client";

import React from "react";
import { LogIn, LogOut } from "lucide-react";

export default function AuthLinks() {
  const isLoggedIn = !!localStorage.getItem("customerSession");

  // Solo limpiamos storage, y dejamos que el <a> haga el logout real
  const handleLogout = () => {
    localStorage.removeItem("customerSession");
    localStorage.removeItem("cart");
  };

  const APP_BASE_URL = process.env.APP_BASE_URL || "https://www.smart-qr.tech";

  return (
    <div className="w-full mr-4 mt-4">
      {!isLoggedIn ? (
        // ✅ Login de Auth0 con returnTo
        <a
          href="/auth/login?returnTo=/customer/dashboard"
          className="block text-white font-semibold bg-default-700 px-4 py-2 rounded-md hover:bg-default-600 transition w-full text-center"
        >
          <LogIn className="inline-block mr-2" />
          Sign In
        </a>
      ) : (
        // ✅ Logout de Auth0 con limpieza local + redirección segura
        <a
          href={`/auth/logout?returnTo=${APP_BASE_URL}/customer/dashboard/logout`}
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