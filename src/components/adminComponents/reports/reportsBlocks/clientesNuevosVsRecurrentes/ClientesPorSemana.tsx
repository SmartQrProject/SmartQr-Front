"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

dayjs.extend(isoWeek);

const ClientesPorSemana = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [data, setData] = useState<{
        newCustomers: number;
        returningCustomers: number;
        newPercentage: number;
        returningPercentage: number;
    } | null>(null);

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const to = dayjs().format("YYYY-MM-DD");
    const from = dayjs().startOf("isoWeek").format("YYYY-MM-DD");

    useEffect(() => {
        if (!slug || !token) return;

        const APIURL = process.env.NEXT_PUBLIC_API_URL;

        const fetchData = async () => {
            try {
                const res = await fetch(`${APIURL}/${slug}/reports/customer-types?from=${from}&to=${to}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Server response error");

                const result = await res.json();
                setData(result);
                setError(false);
            } catch (err) {
                setError(true);
                console.error("Error fetching customer data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, token]);

    if (loading) {
        return (
            <div className="flex gap-4 justify-center items-center h-40">
                <p className="text-sm md:text-2xl text-branding-900">Loading Data...</p>
                <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data) return <p className="text-center text-sm text-red-500">There was a problem loading the data.</p>;
    if (data.newCustomers + data.returningCustomers === 0) return <p className="text-center text-sm text-gray-500">No customers this week.</p>;

    const chartData = [
        { name: "New", value: data.newCustomers },
        { name: "Returning", value: data.returningCustomers },
    ];

    const COLORS = ["#00c49f", "#4b0082"];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">This Week's Customers</h3>

            {/* Donut Chart */}
            <div className="w-full h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={30}
                            outerRadius={80}
                            paddingAngle={3}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Boxes */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg text-center bg-[#f0fdfa]">
                    <h3 className="text-md font-semibold text-[#054237]">New Customers</h3>
                    <p className="text-lg font-bold">{data.newCustomers}</p>
                    <p className="text-gray-500">{data.newPercentage.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg text-center bg-[#f5f3ff]">
                    <h3 className="text-md font-semibold text-[#4b0082]">Returning Customers</h3>
                    <p className="text-lg font-bold">{data.returningCustomers}</p>
                    <p className="text-gray-500">{data.returningPercentage.toFixed(1)}%</p>
                </div>
            </div>
        </div>
    );
};

export default ClientesPorSemana;
