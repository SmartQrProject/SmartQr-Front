"use client";

import React, { useEffect, useState } from "react";
import { IOrder } from "@/types";

interface Props {
    tableId: string;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const OrderBoard: React.FC<Props> = ({ tableId }) => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // ✅ Ensure we're on the client side
                if (typeof window === "undefined") return;

                const session = localStorage.getItem("adminSession");
                if (!session) {
                    setError("No session found.");
                    return;
                }

                const parsed = JSON.parse(session);
                const token = parsed.token;
                const slug = parsed.payload?.slug;

                if (!token || !slug) {
                    setError("Invalid token or slug in session.");
                    return;
                }

                const res = await fetch(`${APIURL}/${slug}/orders/${slug}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server error: ${errorText}`);
                }

                const data: IOrder[] = await res.json();
                const filtered = data.filter((order) => order.tableId === tableId);

                setOrders(filtered);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [tableId]);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (orders.length === 0) return <p className="italic text-gray-500">No orders found for this table.</p>;

    return (
        <div className="p-4 space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white shadow rounded p-4">
                    <p className="font-semibold">Type: {order.order_type}</p>
                    <p>Status: {order.status}</p>
                    <p>Payment: {order.payStatus}</p>
                    <p>Total: €{order.total_price.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
};

export default OrderBoard;
