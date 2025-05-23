"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function SuccessOrderPage() {
  const router = useRouter();

  useEffect(() => {
    const pendingOrder = localStorage.getItem("pendingOrder");
    const session = localStorage.getItem("customerSession");

    if (!pendingOrder || !session) {
      toast.error("❌ Missing data. Please try again.");
      router.push("/");
      return;
    }

    const sessionData = JSON.parse(session);
    const token = sessionData?.token;

    const { customerId, code, products, slug } = JSON.parse(pendingOrder);
    console.log("✅ Pending order data:", { customerId, code, products, slug });
    console.log("✅ Customer session:", sessionData);

    if (!customerId || !slug || !products?.length || !token) {
      console.error("❌ Invalid order data:", { customerId, slug, products, token });
      toast.error("⚠️ Invalid order data.");
      localStorage.removeItem("pendingOrder");
      router.push("/");
      return;
    }

    const sendOrder = async () => {
      try {
        const orderRes = await fetch(`${APIURL}/${slug}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerId,
            code,
            products: products.map((p: any) => ({
              id: p.id,
              quantity: p.quantity,
            })),
          }),
        });

        if (!orderRes.ok) throw new Error(`Order creation failed (${orderRes.status})`);

        localStorage.removeItem("pendingOrder");
        localStorage.setItem("cart", "[]");

        toast.success("✅ Order sent to kitchen!");
        router.push(`/menu/${slug}/confirmation`);
      } catch (err) {
        console.error("❌ Order error:", err);
        toast.error("Could not send order. Please notify staff.");
        router.push(`/menu/${slug}/cart`);
      }
    };

    sendOrder();
  }, [router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-green-700">🎉 Payment Successful</h2>
      <p className="mt-2 text-gray-600">Sending your order to the kitchen...</p>
    </div>
  );
}
