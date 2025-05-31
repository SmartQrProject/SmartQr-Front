"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { useRouter } from "next/navigation";

export default function OrderCardList() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [tableNames, setTableNames] = useState<Record<string, string>>({});
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const role = user?.payload?.role;
    const router = useRouter();

    useEffect(() => {
        if (!role || (role !== "owner" && role !== "staff")) {
            router.push("/404");
            return;
        }
        setAuthorized(true);
        setCheckingAuth(false);
    }, [role, router]);

    useEffect(() => {
        if (!slug || !token || !authorized) return;

        const fetchData = async () => {
            try {
                const [ordersRes, tablesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/restaurant-tables`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const ordersData = await ordersRes.json();
                const tablesJson = await tablesRes.json();
                const tablesData = tablesJson.restaurantTables;

                const mappedOrders = ordersData.map((order: any) => ({
                    ...order,
                    total_price: parseFloat(order.total_price),
                    items: order.items.map((item: any) => ({
                        ...item,
                        price: parseFloat(item.price),
                    })),
                }));

                const tableMap: Record<string, string> = {};
                tablesData.forEach((t: any) => {
                    tableMap[t.id] = t.code;
                });

                setOrders(mappedOrders);
                setTableNames(tableMap);
            } catch (err) {
                toast.error("Failed to load orders or tables");
            }
        };

        fetchData();
    }, [slug, token, authorized]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        if (!slug || !token) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            toast.success(`Order updated to ${newStatus}`);
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        } catch (err) {
            toast.error("Failed to update order");
        }
    };

    const renderByStatus = (status: string, title: string) => (
        <div>
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            {orders
                .filter((o) => o.status === status)
                .map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        tableName={tableNames[order.tableId] || "Unknown"}
                        onAdvanceStatus={(id, st) => updateOrderStatus(id, st)}
                        onRetreatStatus={(id, st) => updateOrderStatus(id, st)}
                    />
                ))}
        </div>
    );

    if (checkingAuth) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderByStatus("pending", "🕑 Pending")}
            {renderByStatus("in-process", "🧑‍🍳 In process")}
            {renderByStatus("ready", "🔔 Ready to serve")}
        </div>
    );
}
