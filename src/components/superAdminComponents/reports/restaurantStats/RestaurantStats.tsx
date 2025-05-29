"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

interface CustomerReachEntry {
    restaurantId: string;
    restaurantName: string;
    customers: number;
}

export default function CustomerReachChart() {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [customerReachData, setCustomerReachData] = useState<CustomerReachEntry[]>([]);

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/reports/admin/customers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch customer reach");

                const data = await res.json();
                setCustomerReachData(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load customer reach data");
            }
        };

        fetchData();
    }, [slug, token]);

    // Divide los datos en chunks de 10
    const chunkedData = [];
    for (let i = 0; i < customerReachData.length; i += 10) {
        chunkedData.push(customerReachData.slice(i, i + 10));
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-6">Customer Reach per Restaurant</h2>

            {chunkedData.map((chunk, index) => (
                <div key={index} className="mb-12">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chunk.map((entry) => ({
                                name: entry.restaurantName,
                                customers: entry.customers,
                            }))}
                            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="customers" fill="#60a5fa" name="Customers" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    );
}
