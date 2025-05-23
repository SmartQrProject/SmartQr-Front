"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";

export default function OrderCardList() {
    const [slug, setSlug] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<IOrder[]>([]);
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
            console.log(data);
            setOrders(data);
        } catch (err) {
            toast.error("Error loading orders");
            console.error("fetchOrders error:", err);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const sessionRaw = localStorage.getItem("adminSession");
            if (sessionRaw) {
                try {
                    const session = JSON.parse(sessionRaw);
                    const extractedToken = session.token;
                    const extractedSlug = session.restaurant?.slug || session.payload?.restaurant?.slug;
                    if (extractedToken && extractedSlug) {
                        setSlug(extractedSlug);
                        setToken(extractedToken);
                        fetchOrders(extractedSlug, extractedToken);
                    }
                } catch (error) {
                    toast.error("Invalid session data");
                    console.error("Error parsing session:", error);
                }
            }
            setLoading(false);
        }
    }, []);

    const getNextStatus = (status: string) => {
        switch (status) {
            case "pending":
                return "in-process";
            case "in-process":
                return "ready";
            case "ready":
                return "completed";
            default:
                return null;
        }
    };

    const getPrevStatus = (status: string) => {
        switch (status) {
            case "in-process":
                return "pending";
            case "ready":
                return "in-process";
            case "completed":
                return "ready";
            default:
                return null;
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        if (!slug || !token) return;

        try {
            const res = await fetch(`${urlback}/${slug}/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success("Order status updated");

            setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Error updating order");
        }
    };

    const handleAdvanceStatus = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;
        const nextStatus = getNextStatus(order.status);
        if (nextStatus) {
            updateOrderStatus(orderId, nextStatus);
        }
    };

    const handleRetreatStatus = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;
        const prevStatus = getPrevStatus(order.status);
        if (prevStatus) {
            updateOrderStatus(orderId, prevStatus);
        }
    };

    const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (loading) return <p>Loading orders...</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <h2 className="text-lg font-bold mb-2">🕑 Pending</h2>
                {getOrdersByStatus("pending").length > 0 ? (
                    getOrdersByStatus("pending").map((order) => (
                        <OrderCard key={order.id} order={order} onAdvanceStatus={handleAdvanceStatus} onRetreatStatus={handleRetreatStatus} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No pending orders.</p>
                )}
            </div>

            <div>
                <h2 className="text-lg font-bold mb-2">🧑‍🍳 In process</h2>
                {getOrdersByStatus("in-process").length > 0 ? (
                    getOrdersByStatus("in-process").map((order) => (
                        <OrderCard key={order.id} order={order} onAdvanceStatus={handleAdvanceStatus} onRetreatStatus={handleRetreatStatus} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No orders in process.</p>
                )}
            </div>

            <div>
                <h2 className="text-lg font-bold mb-2">🔔 Ready to serve</h2>
                {getOrdersByStatus("ready").length > 0 ? (
                    getOrdersByStatus("ready").map((order) => (
                        <OrderCard key={order.id} order={order} onAdvanceStatus={handleAdvanceStatus} onRetreatStatus={handleRetreatStatus} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No ready orders.</p>
                )}
            </div>
        </div>
    );
}
