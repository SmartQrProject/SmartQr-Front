"use client";

import { useEffect, useState } from "react";
import AdminRegisterForm from "./AdminRegisterForm";
import RegisterNewRestaurant
 from "./RegisterNewResturant";
export default function RegisterForm() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminSession");
    if (stored) {
      const payload = JSON.parse(stored)?.payload;
      if (payload?.roles === "owner") {
        setHasSession(true);
      }
    }
  }, []);

  return hasSession ? <RegisterNewRestaurant /> : <AdminRegisterForm />;
}
