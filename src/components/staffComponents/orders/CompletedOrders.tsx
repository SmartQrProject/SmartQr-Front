"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

const transformOrderFromApi = (order: any): IOrder => ({
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
});

export default function CompletedOrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [tableNames, setTableNames] = useState<Record<string, string>>({});
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            try {
                console.log("primer CL");
                const [ordersRes, tablesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/restaurant-tables`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    console.log("segundo CL"),
                ]);

                const ordersData = await ordersRes.json();
                const rawTablesData = await tablesRes.json();
                const tablesData = rawTablesData.restaurantTables;

                const mappedOrders = ordersData.map((o: any) => transformOrderFromApi(o));

                const tableMap: Record<string, string> = {};
                tablesData.forEach((t: any) => {
                    tableMap[t.id] = t.code;
                });

                setOrders(mappedOrders);
                setTableNames(tableMap);
            } catch (err) {
                console.error("Error fetching completed orders:", err);
                toast.error("Failed to load completed orders");
            }
        };

        fetchData();
    }, [slug, token]);
    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    };

    const handleRetreatStatus = (orderId: string) => {
        updateOrderStatus(orderId, "ready");
    };

    const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📦 Completed Orders</h1>
            {getOrdersByStatus("completed").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getOrdersByStatus("completed").map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onAdvanceStatus={() => {}}
                            onRetreatStatus={() => handleRetreatStatus(order.id)}
                            tableName={tableNames[order.tableId] ?? "Unknown"}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-600">No completed orders.</p>
            )}
        </div>
    );
}
