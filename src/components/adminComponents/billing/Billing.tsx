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
                router.push("/login");
            }
        } else {
            router.push("/dashboard");
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
            const res = await fetch(`${APIURL}/${slug}/subscription/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
        return (
            <div className="flex items-center justify-center h-40 gap-3">
                <p className="text-lg font-medium text-branding-900">Checking access...</p>
                <div className="w-6 h-6 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (role !== "owner") return null;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-semibold text-gray-900">Billing Summary</h1>

            {subscription ? (
                <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
                    <p><span className="font-semibold">Plan:</span> {subscription.planStripeId}</p>
                    <p><span className="font-semibold">Status:</span> {subscription.status}</p>
                    <p><span className="font-semibold">Trial:</span> {subscription.isTrial ? "Yes" : "No"}</p>
                    <p><span className="font-semibold">Next Billing Date:</span> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Created At:</span> {new Date(subscription.createdAt).toLocaleDateString()}</p>
                </div>
            ) : (
                <div className="flex items-center justify-center h-40 gap-3">
                    <p className="text-lg text-branding-900">Loading subscription details...</p>
                    <div className="w-6 h-6 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <div>
                <ButtonPrimary
                    disabled={isCancelling || cancelled}
                    loading={isCancelling}
                    onClick={() => setShowConfirm(true)}
                >
                    {cancelled ? "Cancellation Scheduled" : "Cancel Subscription"}
                </ButtonPrimary>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none z-40" />
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4 relative z-50 pointer-events-auto">
                        <h2 className="text-xl font-semibold text-gray-800">Cancel Subscription</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to cancel your subscription? This change will take effect at the end of your current billing period.</p>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                onClick={handleCancelSubscription}
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
