"use client";

import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import toast from "react-hot-toast";

const mockBillingHistory = [
  {
    id: "1",
    date: "2025-04-01",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "2",
    date: "2025-03-01",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "3",
    date: "2025-02-01",
    amount: "$49.00",
    status: "Paid",
  },
];

export default function BillingComponent() {
  const [slug, setSlug] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const storedSlug = localStorage.getItem("slug");
    if (storedSlug) {
      setSlug(storedSlug);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!slug) {
      toast.error("No restaurant slug found.");
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/${slug}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription will be cancelled at the end of the period.");
      setCancelled(true);
    } catch (error) {
      toast.error("Failed to cancel subscription. Please try again later.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Billing History</h2>
      <div className="space-y-4">
        {mockBillingHistory.map((entry) => (
          <div
            key={entry.id}
            className="border rounded-xl bg-white shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{entry.date}</p>
              <p className="text-sm text-gray-500">{entry.status}</p>
            </div>
            <div className="text-lg font-semibold">{entry.amount}</div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <ButtonPrimary
          disabled={isCancelling || cancelled}
          loading={isCancelling}
          onClick={handleCancelSubscription}
        >
          {cancelled ? "Cancellation Scheduled" : "Cancel Subscription"}
        </ButtonPrimary>
      </div>
    </div>
  );
}
