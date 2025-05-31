"use client";
import React, { useEffect, useState } from "react";
import { getOrdersById } from "../fetch/cart";

interface Table {
    id: string;
    code: string;
    is_active: boolean;
    exist: boolean;
    created_at: string;
}

interface OrderItem {
    product: {
        name: string;
    };
    quantity: number;
}

interface Order {
    id: string;
    status: string;
    payStatus: string;
    order_type: string;
    total_price: number;
    payment_method: string | null;
    discount_applied: number;
    served_at: string | null;
    created_at: string;
    table?: Table;
    items: OrderItem[];
}

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleGetOrders = async () => {
        setLoading(true);
        setError(null);
        const slug = localStorage.getItem("slug") || "";
        const storedSession = localStorage.getItem("customerSession");
        const sessionData = storedSession ? JSON.parse(storedSession) : null;
        const token = sessionData?.token;
        const id = sessionData?.payload?.id;

        if (!slug || !token || !id) {
            setError("Missing session data");
            setLoading(false);
            return;
        }

        try {
            const response = await getOrdersById(token, id, slug);
            setOrders(response.orders || []);
        } catch (err) {
            console.error("❌ Error fetching orders:", err);
            setError("Error loading orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetOrders();

        const intervalId = setInterval(() => {
            handleGetOrders();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const activeStatuses = ["pending", "in-process", "approved", "ready"];

    const now = new Date().getTime();

    const recentlyCompletedOrders = orders.filter((order) => order.status === "completed" && now - new Date(order.created_at).getTime() < 3600000);

    const activeOrders = orders.filter((order) => activeStatuses.includes(order.status)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const historyOrders = orders
        .filter((order) => !activeStatuses.includes(order.status) && !recentlyCompletedOrders.includes(order))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const renderOrderCard = (order: Order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3">
            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Order ID:
                <span className="font-normal text-gray-600">{order.id}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Order Status:
                <span
                    className={`font-semibold ${
                        order.status === "approved"
                            ? "text-blue-600"
                            : order.status === "pending"
                              ? "text-red-600"
                              : order.status === "in-process"
                                ? "text-yellow-600"
                                : order.status === "ready"
                                  ? "text-green-600"
                                  : order.status === "rejected"
                                    ? "text-gray-600"
                                    : order.status === "completed"
                                      ? "text-green-700"
                                      : "text-purple-600"
                    }`}
                >
                    {order.status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                </span>
            </p>
            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Table:
                <span className="font-normal text-gray-600">{order.table?.code}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Payment Status:
                <span className="text-gray-600">{order.payStatus}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Order Date:
                <span className="text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800 flex justify-between">
                Total Price:
                <span className="text-gray-600">${order.total_price}</span>
            </p>

            <div className="mt-3">
                <p className="text-lg font-semibold text-gray-800 mb-2">Items:</p>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between px-4 py-2 text-gray-700">
                            <span>{item.product.name}</span>
                            <span className="font-semibold">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading orders...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="p-4 md:min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Active Orders</h2>

                    {recentlyCompletedOrders.length > 0 && (
                        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-900">
                            Your order(s) completed less than an hour ago and now appear in the order history.
                        </div>
                    )}

                    {activeOrders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{activeOrders.map((order) => renderOrderCard(order))}</div>
                    ) : (
                        <p className="text-gray-600 italic">No active orders</p>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Order History</h2>
                    {historyOrders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{historyOrders.map((order) => renderOrderCard(order))}</div>
                    ) : (
                        <p className="text-gray-600 italic">No past orders</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default OrderHistory;
