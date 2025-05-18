"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userCreateRestaurantAndUser } from "@/libs/hooks/userCreateRestaurantAndUser";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const { create } = userCreateRestaurantAndUser();

  useEffect(() => {
    const pendingData = localStorage.getItem("pendingRestaurant");
    console.log("✅ SuccessPage mounted");
    console.log("pendingRestaurant:", localStorage.getItem("pendingRestaurant"));

    if (!pendingData) {
      toast.error("No registration data found.");
      router.push("/signup");
      return;
    }

    const parsedData = JSON.parse(pendingData);
    

    create({
      name: parsedData.name,
      email: parsedData.email,
      password: parsedData.password,
      slug: parsedData.slug 
    })
      .then(() => {
        localStorage.removeItem("pendingRestaurant");
        toast.success("Restaurant successfully created!");
        router.push("/dashboard");
      })
      .catch((err) => {
        toast.error("Error finalizing registration: " + err.message);
        router.push("/signup");
      });
  }, [create, router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">Thank you for your payment!</h2>
      <p>We’re setting up your restaurant...</p>
    </div>
  );
}
