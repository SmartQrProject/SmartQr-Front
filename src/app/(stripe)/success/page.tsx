"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateRestaurantAndUser } from "@/libs/hooks/useCreateRestaurantAndUser";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const { create } = useCreateRestaurantAndUser();

  useEffect(() => {
    const pendingData = localStorage.getItem("pendingRestaurant");

    if (!pendingData) {
      toast.error("No registration data found.");
      router.push("/signup");
      return;
    }

    const parsedData = JSON.parse(pendingData);

    create({
      storeName: parsedData.storeName,
      email: parsedData.email,
      password: parsedData.password,
      slug: parsedData.slug,
    }).then(() => {
      
      localStorage.removeItem("pendingRestaurant");
    }).catch((err) => {
      toast.error("Error finalizing registration: " + err.message);
    });
  }, [create, router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">Thank you for your payment!</h2>
      <p>We’re setting up your restaurant...</p>
    </div>
  );
}
