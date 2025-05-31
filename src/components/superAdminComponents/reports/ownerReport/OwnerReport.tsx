"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

const formatMonth = (isoString: string): string => {
    const date = new Date(`${isoString}-01`);
    return date.toLocaleString("en-US", { month: "long" });
};

export default function RestaurantStats() {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [restaurantStatsData, setRestaurantStatsData] = useState<{ name: string; newRestaurants: number; canceledRestaurants: number }[]>([]);

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/reports/admin/restaurants`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch restaurant stats");

                const rawData = await res.json();

                const formatted = rawData.map((entry: any) => ({
                    name: formatMonth(entry.month),
                    newRestaurants: entry.newRestaurants,
                    canceledRestaurants: entry.canceledRestaurants,
                }));

                setRestaurantStatsData(formatted);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load restaurant statistics");
            }
        };

        fetchData();
    }, [slug, token]);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full">
            <h2 className="text-base sm:text-xl font-bold mb-4 text-center sm:text-left">New Restaurants vs Cancellations</h2>
            <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={restaurantStatsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newRestaurants" fill="#4ade80" name="New" />
                        <Bar dataKey="canceledRestaurants" fill="#f87171" name="Canceled" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
