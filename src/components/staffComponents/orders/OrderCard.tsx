"use client";

import React, { useEffect, useState } from "react";
import { IOrder, IOrderItem } from "@/types";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

interface Props {
    order: IOrder;
    tableName: string;
    onAdvanceStatus: (orderId: string, newStatus: string) => void;
    onRetreatStatus: (orderId: string, newStatus: string) => void;
    onStatusChange?: () => void;
}

const OrderCard: React.FC<Props> = ({ order, tableName, onAdvanceStatus, onRetreatStatus, onStatusChange }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    useEffect(() => {
        const interval = setInterval(() => {
            const created = new Date(order.created_at);
            const now = new Date();
            const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
            setTimeElapsed(seconds);
        }, 1000);

        return () => clearInterval(interval);
    }, [order.created_at]);

    const formatDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

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

    const updateStatusOnServer = async (newStatus: string, direction: "advance" | "retreat") => {
        if (!slug || !token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders/${order.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Error al actualizar estado");

            if (direction === "advance") onAdvanceStatus(order.id, newStatus);
            else onRetreatStatus(order.id, newStatus);

            toast.success(`Order updated to ${newStatus}`);
            if (onStatusChange) onStatusChange();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order status");
        }
    };

    const total = Array.isArray(order.items) ? order.items.reduce((acc: number, item: IOrderItem) => acc + item.price * item.quantity, 0) : 0;

    const nextStatus = getNextStatus(order.status);
    const prevStatus = getPrevStatus(order.status);

    return (
        <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-md">
            <div className="text-sm text-gray-600 mb-2">
                <p>🕒 Time: {formatDuration(timeElapsed)}</p>
                <p>🧾 Total: ${total.toFixed(2)}</p>
                <p className="italic">🪑 Table: {tableName}</p>
            </div>

            <ul className="mb-3 text-sm space-y-2">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item) => (
                        <li key={item.id}>
                            <strong>{item.name}</strong> ({item.quantity}) - ${item.price}
                            <p className="text-xs text-gray-500 italic">{item.description}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-red-500 text-sm">No items found in this order.</p>
                )}
            </ul>

            <div className="flex gap-2 flex-wrap">
                {prevStatus && (
                    <button
                        onClick={() => updateStatusOnServer(prevStatus, "retreat")}
                        className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                    >
                        Back to: {prevStatus}
                    </button>
                )}
                {nextStatus ? (
                    <button
                        onClick={() => updateStatusOnServer(nextStatus, "advance")}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        Advance to: {nextStatus}
                    </button>
                ) : (
                    <p className="mt-2 text-green-600 text-sm font-semibold">✅ Delivered</p>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
