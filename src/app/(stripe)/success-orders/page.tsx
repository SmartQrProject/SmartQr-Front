'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SuccessOrderPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("pendingOrder");
    localStorage.setItem("cart", "[]");
    toast.success("🎉 Payment successful. Thank you!");

    const slug = localStorage.getItem("slug") || "";
    setTimeout(() => {
      router.push(`/customer/dashboard`);
    }, 2000);
  }, [router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-green-700">🎉 Payment Successful</h2>
      <p className="mt-2 text-gray-600">Redirecting to confirmation...</p>
    </div>
  );
}
