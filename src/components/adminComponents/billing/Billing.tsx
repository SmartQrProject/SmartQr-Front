"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import toast from "react-hot-toast";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface SubscriptionData {
    subscriptionId: string;
    stripeSubscriptionId: string;
    customerStripeId: string;
    status: string;
    planStripeId: string;
    currentPeriodEnd: string;
    createdAt: string;
    isTrial: boolean;
    cancelAtPeriodEnd: boolean;
    restaurantName: string;
    ownerEmail: string;
}

export default function BillingComponent() {
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [token, setToken] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem("adminSession");
        if (session) {
            const parsed = JSON.parse(session);
            const roleFromSession = parsed.payload?.roles || null;
            const slugFromSession = parsed.payload?.slug || "";
            const tokenFromSession = parsed.token || "";

            setRole(roleFromSession);
            setSlug(slugFromSession);
            setToken(tokenFromSession);

            if (roleFromSession !== "owner") {
                router.push("/admin/dashboard");
            }
        } else {
            router.push("/admin/login");
        }

        setCheckingAuth(false);
    }, [router]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!slug || !token) return;

            try {
                const res = await fetch(`${APIURL}/${slug}/subscription`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch subscription");

                const data: SubscriptionData = await res.json();
                setSubscription(data);
                setCancelled(data.cancelAtPeriodEnd);
            } catch (error) {
                toast.error("Failed to load subscription data");
                console.error(error);
            }
        };

        fetchSubscriptions();
    }, [slug, token]);

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
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to cancel subscription");

            toast.success("Subscription cancellation scheduled.");
            setCancelled(true);
        } catch (error) {
            toast.error("Failed to cancel subscription. Please try again later.");
            console.error(error);
        } finally {
            setIsCancelling(false);
            setShowConfirm(false);
        }
    };

    if (checkingAuth) {
        return <p className="p-4 text-center">Checking access...</p>;
    }

    if (role !== "owner") {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h2 className="text-2xl font-bold">Billing Summary</h2>

            {subscription ? (
                <div className="border rounded-xl bg-white shadow p-4 space-y-2">
                    <p>
                        <strong>Plan:</strong> {subscription.planStripeId}
                    </p>
                    <p>
                        <strong>Status:</strong> {subscription.status}
                    </p>
                    <p>
                        <strong>Trial:</strong> {subscription.isTrial ? "Yes" : "No"}
                    </p>
                    <p>
                        <strong>Next Billing Date:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Created At:</strong> {new Date(subscription.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Loading subscription details...</p>
            )}

            <div className="pt-6">
                <ButtonPrimary disabled={isCancelling || cancelled} loading={isCancelling} onClick={() => setShowConfirm(true)}>
                    {cancelled ? "Cancellation Scheduled" : "Cancel Subscription"}
                </ButtonPrimary>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Are you sure you want to cancel your subscription?</h3>
                        <div className="flex justify-end gap-4">
                            <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowConfirm(false)}>
                                No
                            </button>
                            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleCancelSubscription}>
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
