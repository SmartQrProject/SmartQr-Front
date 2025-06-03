"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Clock4, ChefHat, Bell } from "lucide-react";

function parseJwt(token: string) {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        console.error("Invalid token");
        return null;
    }
}

export default function OrderCardList() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [tableNames, setTableNames] = useState<Record<string, string>>({});
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [slug, setSlug] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const router = useRouter();

    const getTableName = (order: IOrder) => {
        if (!order.tableId || !tableNames[order.tableId]) {
            return "Counter";
        }
        return tableNames[order.tableId];
    };

    useEffect(() => {
        const cookieToken = Cookies.get("adminSession");
        if (!cookieToken) {
            router.push("/");
            return;
        }

        const payload = parseJwt(cookieToken);
        const role = payload?.roles;

        if (role === "owner" || role === "staff") {
            setToken(cookieToken);
            setSlug(payload?.slug || "");
            setAuthorized(true);
        } else {
            router.push("/404");
        }

        setCheckingAuth(false);
    }, [router]);

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

    const renderByStatus = (status: string, title: string, Icon: React.ElementType) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2">
                <Icon className="h-6 w-6 text-sky-600" />
                <span>{title}</span>
            </div>
            <div className="space-y-3">
                {orders
                    .filter((o) => o.status === status)
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            tableName={getTableName(order)}
                            onAdvanceStatus={(id, st) => updateOrderStatus(id, st)}
                            onRetreatStatus={(id, st) => updateOrderStatus(id, st)}
                        />
                    ))}
            </div>
        </div>
    );

    if (checkingAuth)
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
        );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-4 py-6">
            {renderByStatus("pending", "Pending", Clock4)}
            {renderByStatus("in-process", "In Process", ChefHat)}
            {renderByStatus("ready", "Ready to Serve", Bell)}
        </div>
    );
}
