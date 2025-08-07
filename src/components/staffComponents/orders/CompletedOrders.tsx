"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Box } from "lucide-react";
import { MdTakeoutDining } from "react-icons/md";
import { RiTakeawayFill, RiTakeawayLine } from "react-icons/ri";
import { GiBoxUnpacking } from "react-icons/gi";
import { CgMenuBoxed } from "react-icons/cg";

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

function parseJwt(token: string) {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

export default function CompletedOrdersPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [tableNames, setTableNames] = useState<Record<string, string>>({});
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [slug, setSlug] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const router = useRouter();

   const getTableName = (order: IOrder) => {
    if (order.order_type === "delivery") return "Delivery";

    if (order.tableId && tableNames[order.tableId]) {
        return `Table ${tableNames[order.tableId]}`;
    }

    return "Counter";
    };




    useEffect(() => {
        const cookieToken = Cookies.get("adminSession");

        if (!cookieToken) {
            router.push("/");
            return;
        }

        const payload = parseJwt(cookieToken);
        const roles = payload?.roles;

        let slugFromStorage = "";
        if (typeof window !== "undefined") {
            const sessionRaw = localStorage.getItem("adminSession");
            if (sessionRaw) {
                try {
                    const session = JSON.parse(sessionRaw);
                    slugFromStorage =
                        session.restaurant?.slug ||
                        session.payload?.restaurant?.slug ||
                        session.payload?.slug ||
                        "";
                } catch {
                    slugFromStorage = "";
                }
            }
        }

        if (!roles || (!roles.includes("owner") && !roles.includes("staff"))) {
            router.push("/404");
            return;
        }

        setToken(cookieToken);
        setSlug(payload.slug || slugFromStorage);
        setAuthorized(true);
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
                toast.error("Failed to load completed orders");
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [slug, token, authorized]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
            toast.success(`Order updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update order status");
            console.error("Error updating order status:", err);
        }
    };

    const handleRetreatStatus = async (orderId: string) => {
        await updateOrderStatus(orderId, "ready");
    };

    const getOrdersByStatus = (status: string) => orders.filter((o) => o.status === status).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const isRevertAllowed = (createdAt: string) => {
        const now = new Date();
        const completedTime = new Date(createdAt);
        const diffInMs = now.getTime() - completedTime.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours <= 2;
    };

    if (checkingAuth) return null;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex gap-2 items-center"><CgMenuBoxed/> Completed Orders</h2>
            {getOrdersByStatus("completed").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getOrdersByStatus("completed").map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onAdvanceStatus={() => {}}
                            onRetreatStatus={() => handleRetreatStatus(order.id)}
                            tableName={getTableName(order)}
                            allowRetreat={isRevertAllowed(order.created_at)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-600">No completed orders.</p>
            )}
        </div>
    );
}
