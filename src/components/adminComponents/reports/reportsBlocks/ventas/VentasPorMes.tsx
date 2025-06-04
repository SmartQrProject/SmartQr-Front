"use client";

import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, ReferenceLine } from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const VentasPorMes = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const chartRef = useRef(null);

    const [data, setData] = useState<{ name: string; total: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [metaMensual, setMetaMensual] = useState(3000);
    const [hoverY, setHoverY] = useState<number | null>(null);

    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        const fetchTotal = async () => {
            if (!slug || !token) return;
            const APIURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const res = await fetch(`${APIURL}/${slug}/reports/sales?from=${start}&to=${end}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await res.json();
                const total = result.total ?? 0;
                setData([{ name: "Current Month", total }]);
            } catch (err) {
                console.error("Error fetching monthly sales:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTotal();
    }, [slug, token, start, end]);

    return (
        <div ref={chartRef} className="bg-white p-4 sm:p-6 rounded-xl w-full mb-6 max-w-full">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Monthly Sales</h3>
            <p className="text-sm mb-4 text-center">
                From <strong>{start}</strong> to <strong>{end}</strong>
            </p>

            {loading ? (
                <p className="text-sm text-gray-500 text-center">Loading...</p>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No sales this month.</p>
            ) : (
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            onMouseMove={(e: any) => {
                                if (e?.activeCoordinate?.yValue != null) {
                                    setHoverY(e.activeCoordinate.yValue);
                                }
                            }}
                            onMouseLeave={() => setHoverY(null)}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, Math.max(metaMensual, data[0].total) + 300]} />
                            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]} />
                            {hoverY !== null && <ReferenceLine y={hoverY} stroke="gray" strokeDasharray="2 2" ifOverflow="extendDomain" />}
                            <Bar dataKey="total" fill="#ffc658" animationDuration={700}>
                                <LabelList dataKey="total" position="top" formatter={(v: number) => `$${v}`} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default VentasPorMes;
