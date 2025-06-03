"use client";

import React, { useEffect, useState } from "react";
import { IOrder, IOrderItem } from "@/types";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";
import { CheckCircle, ReceiptIcon, Timer } from "lucide-react";
import { FaChair } from "react-icons/fa";


interface Props {
    order: IOrder;
    tableName: string;
    onAdvanceStatus: (orderId: string, newStatus: string) => void;
    onRetreatStatus: (orderId: string, newStatus: string) => void;
    onStatusChange?: () => void;
    allowRetreat?: boolean; 
}

const OrderCard: React.FC<Props> = ({ order, tableName, onAdvanceStatus, onRetreatStatus, onStatusChange, allowRetreat = true }) => {
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

    const updateStatusOnServer = (newStatus: string, direction: "advance" | "retreat") => {
        if (direction === "advance") onAdvanceStatus(order.id, newStatus);
        else onRetreatStatus(order.id, newStatus);
        };

    const total = Array.isArray(order.items) ? order.items.reduce((acc: number, item: IOrderItem) => acc + item.price * item.quantity, 0) : 0;

    const nextStatus = getNextStatus(order.status);
    const prevStatus = getPrevStatus(order.status);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4  ">
            <div className="text-md text-gray-800 mb-2 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 pb-2 md:justify-between sm:justify-start md:px-5">
                <p className="flex items-center gap-1">
                    <Timer className="h-4 w-4 text-branding-600" />
                    <span className="font-semibold">Time:</span> {formatDuration(timeElapsed)}
                </p>
                <p className="flex items-center gap-1">
                    <ReceiptIcon className="h-4 w-4 text-branding-600" />
                    <span className="font-semibold">Total:</span> ${total.toFixed(2)}
                </p>
                <p className="flex items-center gap-1 font-bold">
                    <FaChair className="h-4 w-4 text-branding-600" />
                    <span className="font-semibold">Table:</span> {tableName}
                </p>
            </div>


            <ul className="mb-3 text-lg space-y-2">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item) => (
               
                        <li key={item.id}>
                            <strong>{item.name}</strong> x <strong >{item.quantity}</strong> 
                            {/* <p className="text-xs text-gray-500 italic">{item.description}</p> */}
                        </li>
                        
                    ))
                ) : (
                    <p className="text-red-500 text-sm">No items found in this order.</p>
                )}
            </ul>

            <div className="flex gap-2 flex-wrap">
                {prevStatus &&
                    (allowRetreat ? (
                        <button
                            onClick={() => updateStatusOnServer(prevStatus, "retreat")}
                            className="mt-2 px-3 py-1 bg-yellow-600 text-white font-semibold rounded-lg text-sm hover:bg-yellow-500 transition cursor-pointer"
                        >
                            Back to: {prevStatus}
                        </button>
                    ) : (
                        <button className="mt-2 px-3 py-1 bg-gray-300 text-gray-500 rounded-lg text-sm cursor-not-allowed " disabled>
                            Back disabled
                        </button>
                    ))}
                {nextStatus ? (
                    <button
                        onClick={() => updateStatusOnServer(nextStatus, "advance")}
                        className="mt-2 px-3 py-1 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition cursor-pointer"
                    >
                        Advance to: {nextStatus}
                    </button>
                ) : (
                    <p className="mt-2 text-green-600 text-sm font-semibold flex gap-2 items-center"><CheckCircle/> Delivered</p>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
