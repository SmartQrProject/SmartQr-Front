"use client";

import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import toast from "react-hot-toast";

const mockBillingHistory = [
  { id: "1", date: "2025-04-01", amount: "$49.00", status: "Paid" },
  { id: "2", date: "2025-03-01", amount: "$49.00", status: "Paid" },
  { id: "3", date: "2025-02-01", amount: "$49.00", status: "Paid" },
];

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function BillingComponent() {
  const [slug, setSlug] = useState("");
  const [token, setToken] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (session) {
      const parsed = JSON.parse(session);
      setSlug(parsed.payload?.slug || "");
      setToken(parsed.token || "");
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!slug || !token) {
      toast.error("Missing credentials to cancel subscription.");
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`${APIURL}/${slug}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription cancellation scheduled.");
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
          onClick={() => setShowConfirm(true)}
        >
          {cancelled ? "Cancellation Scheduled" : "Cancel Subscription"}
        </ButtonPrimary>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to cancel your subscription?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setShowConfirm(false);
                  handleCancelSubscription();
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
