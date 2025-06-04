"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type Cliente = {
    name: string;
    averageOrder: number;
    orders: number;
};

const TopClientesPorTicket = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const [data, setData] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug || !token) return;

        const APIURL = process.env.NEXT_PUBLIC_API_URL;

        const fetchData = async () => {
            try {
                const res = await fetch(`${APIURL}/${slug}/reports/customers?sortBy=averageOrder&order=desc&limit=10&page=1`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                setData(Array.isArray(json.data) ? json.data : []);
            } catch (err) {
                console.error("Error fetching top customers by ticket:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, token]);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-left sm:text-center">Top 10 Customers by Average Ticket</h3>

            {loading ? (
                <div className="flex gap-4 justify-center items-center h-40">
                    <p className="text-sm md:text-lg text-branding-900">Loading...</p>
                    <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No data available.</p>
            ) : (
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 50, left: 100, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                                formatter={(value: number, name: string) => (name === "averageOrder" ? [`$${value.toFixed(2)}`, "Average per order"] : [`${value}`, "Orders"])}
                            />
                            <Bar dataKey="averageOrder" fill="#ffc658">
                                <LabelList dataKey="orders" position="right" formatter={(v: number) => `${v} ord`} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TopClientesPorTicket;
