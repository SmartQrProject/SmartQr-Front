"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  
    useEffect(() => {

      toast.success("🎉 Payment successful. Thank you!");
  
      setTimeout(() => {
        router.push(`/login`);
      }, 2000);
    }, [router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">🎉 Thank you for your payment!</h2>
      <p className="mt-4 text-gray-700">
        Your restaurant is being activated. You can now log in and start managing your store.
      </p>

   
    </div>
  );
}
