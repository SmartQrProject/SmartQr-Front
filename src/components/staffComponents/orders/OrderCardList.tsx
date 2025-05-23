"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

const transformOrdersFromApi = (data: any[]): IOrder[] =>
    data.map((order) => ({
        id: order.id,
        status: order.status,
        order_type: order.order_type,
        tableId: order.tableId,
        restaurantId: order.restaurantSlug,
        userId: order.userId,
        created_at: order.created_at,
        total_price: parseFloat(order.total_price),
        items: order.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: parseFloat(item.price),
            quantity: item.quantity,
        })),
    }));

export default function OrderCardList() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    useEffect(() => {
        if (!slug || !token) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setOrders(transformOrdersFromApi(data));
            } catch (err) {
                console.error("Error fetching orders:", err);
                toast.error("Failed to load orders");
            }
        };

        fetchOrders();
    }, [slug, token]);

    const patchOrderStatus = async (orderId: string, newStatus: string) => {
        if (!slug || !token) return false;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            console.log("Este es el nuevo estado: ", newStatus);
            if (!res.ok) throw new Error("Error updating order");

            toast.success(`Order updated to ${newStatus}`);
            setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order");
            return false;
        }
    };

    const handleAdvanceStatus = async (orderId: string, newStatus: string) => {
        await patchOrderStatus(orderId, newStatus);
    };

    const handleRetreatStatus = async (orderId: string, newStatus: string) => {
        await patchOrderStatus(orderId, newStatus);
    };

    const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

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
