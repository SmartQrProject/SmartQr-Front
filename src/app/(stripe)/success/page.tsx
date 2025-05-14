"use client";
import { useEffect, useState } from "react";
import { useCreateRestaurantAndUser } from "@/libs/hooks/useCreateRestaurantAndUser";

export default function SuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { create } = useCreateRestaurantAndUser();

  useEffect(() => {
    const stored = localStorage.getItem("pendingRestaurant");
    if (!stored) return;

    const data = JSON.parse(stored);
    create(data).finally(() => setIsLoading(false));
  }, [create]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">✅ Payment Completed</h1>
      {isLoading ? (
        <div className="flex flex-col items-center">
          <p>We are creating your restaurant and user...</p>
          <div className="mt-4 w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <p>Completed.</p>
      )}
    </div>
  );
}
