"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
    tableId: string;
    isActive: boolean;
    onToggle: () => void;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const ToggleActiveSwitch: React.FC<Props> = ({ tableId, isActive, onToggle }) => {
    const [active, setActive] = useState(isActive);
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        if (!APIURL) {
            toast.error("API URL is not defined");
            return;
        }

        try {
            setLoading(true);

            const session = localStorage.getItem("adminSession");
            if (!session) {
                toast.error("Session not found");
                return;
            }

            const parsed = JSON.parse(session);
            const token = parsed.token;
            const slug = parsed.restaurant?.slug || parsed.payload?.restaurant?.slug;

            if (!token || !slug) {
                toast.error("Invalid session data");
                return;
            }

            const newStatus = !active;

            const res = await fetch(`${APIURL}/${slug}/restaurant-tables/${tableId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ is_active: newStatus }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            toast.success("Table status updated successfully");
            setActive(newStatus);
            onToggle();
        } catch (err: any) {
            toast.error("Update failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={toggle}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${active ? "bg-green-400" : "bg-gray-400"} ${loading ? "opacity-50" : ""}`}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${active ? "translate-x-5" : "translate-x-0"}`} />
        </div>
    );
};

export default ToggleActiveSwitch;
