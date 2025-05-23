"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";

export default function CompletedOrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [slug, setSlug] = useState<string | null>(null);
    const urlback = process.env.NEXT_PUBLIC_API_URL;

    const fetchOrders = async (slug: string, token: string) => {
        try {
            const res = await fetch(`${urlback}/${slug}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(data);
        } catch (err) {
            toast.error("Error fetching orders");
            console.error("fetchOrders error:", err);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        if (!token || !slug) return;

        try {
            const res = await fetch(`${urlback}/${slug}/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update order");

            toast.success("Order moved to 'ready'");
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        } catch (err) {
            toast.error("Error updating order status");
            console.error("updateOrderStatus error:", err);
        }
    };

    useEffect(() => {
        const sessionRaw = localStorage.getItem("adminSession");
        if (sessionRaw) {
            try {
                const session = JSON.parse(sessionRaw);
                const extractedToken = session.token;
                const extractedSlug = session.restaurant?.slug || session.payload?.restaurant?.slug;
                if (extractedToken && extractedSlug) {
                    setToken(extractedToken);
                    setSlug(extractedSlug);
                    fetchOrders(extractedSlug, extractedToken);
                }
            } catch (err) {
                toast.error("Invalid session data");
                console.error("Session parsing error:", err);
            }
        }
    }, []);

    const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">✅ Completed Orders - {slug}</h1>

            {getOrdersByStatus("completed").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getOrdersByStatus("completed").map((order) => (
                        <OrderCard key={order.id} order={order} onAdvanceStatus={() => {}} onRetreatStatus={() => updateOrderStatus(order.id, "ready")} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-600">No completed orders.</p>
            )}
        </div>
    );
}
