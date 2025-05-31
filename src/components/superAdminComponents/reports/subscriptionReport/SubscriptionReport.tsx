"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

const COLORS = ["#4f46e5", "#a1a1aa"];
const CONVERSION_COLORS = ["#4ade80", "#f87171"];

export default function SubscriptionReport() {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [subscriptionData, setSubscriptionData] = useState([
        { name: "Monthly", value: 0 },
        { name: "Free Trial", value: 0 },
    ]);

    const [conversionData, setConversionData] = useState([
        { name: "Converted", value: 0 },
        { name: "Not Converted", value: 0 },
    ]);

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/reports/admin/subscriptions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch subscription data");

                const data = await res.json();

                setSubscriptionData([
                    { name: "Monthly", value: data.monthly || 0 },
                    { name: "Free Trial", value: data.free_trial || 0 },
                ]);

                const converted = data.convertedFromTrial || 0;
                const notConverted = (data.free_trial || 0) - converted;

                setConversionData([
                    { name: "Converted", value: converted },
                    { name: "Not Converted", value: Math.max(notConverted, 0) },
                ]);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
                toast.error("Failed to load subscription report");
            }
        };

        fetchData();
    }, [slug, token]);

    const totalConversions = conversionData.reduce((acc, item) => acc + item.value, 0);
    const conversionRate = totalConversions ? ((conversionData[0].value / totalConversions) * 100).toFixed(1) : "0.0";

    return (
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Subscription Type Distribution */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">Restaurants Subscription Type</h2>
                <div className="w-full h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={subscriptionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={(entry) => `${entry.name} (${entry.value})`} // ✅ Aquí se personaliza
                            >
                                {subscriptionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Free Trial Conversion */}
            <div className="bg-white rounded-xl p-4 shadow-md">
                <h2 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">Free Trial Conversion</h2>
                <p className="text-gray-600 text-sm mb-2 text-center sm:text-left">
                    {conversionData[0].value} of {totalConversions} users converted (<strong>{conversionRate}%</strong>)
                </p>
                <div className="w-full h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={conversionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                {conversionData.map((entry, index) => (
                                    <Cell key={`cell-conv-${index}`} fill={CONVERSION_COLORS[index % CONVERSION_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
