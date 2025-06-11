"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/types";
import OrderCard from "./OrderCard";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2, Clock4, ChefHat, Bell } from "lucide-react";
import { parseJwt } from "@/utils/jwt";


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

            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                )
            );
        } catch (err) {
            toast.error("Failed to update order");
        }
    };

    //Order updated to in-process
    

    const renderByStatus = (status: string, title: string, Icon: React.ElementType) => (
        <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-md min-h-[60vh] sm:min-h-[65vh] md:h-full overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white z-10 pb-2 mb-2 border-b flex items-center gap-2 text-base font-semibold">
                <Icon className="h-5 w-5 text-blue-600" />
                <span>{title}</span>
            </div>

            <div className="overflow-x-auto md:overflow-y-auto w-full flex-1">
                <div className="flex gap-4 md:flex-col">
                    {orders
                        .filter((o) => o.status === status)
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((order) => (
                            <div key={order.id} className="min-w-[90%] max-w-[90%] md:min-w-0 md:max-w-full">
                                <OrderCard
                                    order={order}
                                    tableName={getTableName(order)}
                                    onAdvanceStatus={(id, st) => updateOrderStatus(id, st)}
                                    onRetreatStatus={(id, st) => updateOrderStatus(id, st)}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );

    if (checkingAuth)
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
        );

    return (
        <div className="overflow-visible md:overflow-hidden h-auto md:h-[calc(100vh-100px)]">
            <div className="grid md:grid-cols-3 gap-4 h-full px-4 py-6">
                {renderByStatus("pending", "Pending", Clock4)}
                {renderByStatus("in-process", "In Process", ChefHat)}
                {renderByStatus("ready", "Ready to Serve", Bell)}
            </div>
        </div>
    );
}
