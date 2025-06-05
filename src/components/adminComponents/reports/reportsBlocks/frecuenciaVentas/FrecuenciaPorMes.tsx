"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

// Hook para el ancho de pantalla
function useWindowWidth() {
    const [width, setWidth] = useState<number | null>(null);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
}

type PuntoDia = {
    label: string; // "1", "2", ..., "31"
    count: number;
};

const FrecuenciaPorMes = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const screenWidth = useWindowWidth();

    const [data, setData] = useState<PuntoDia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug || !token) return;
        const APIURL = process.env.NEXT_PUBLIC_API_URL;

        const fetchData = async () => {
            try {
                const res = await fetch(`${APIURL}/${slug}/reports/sales-frequency?group=monthday`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json();
                setData(Array.isArray(json) ? json : []);
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, token]);

    const xTickFontSize = screenWidth !== null && screenWidth < 480 ? 10 : 12;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">Monthly Sales Frequency</h3>

            {loading ? (
                <div className="flex gap-4 justify-center items-center h-40">
                    <p className="text-sm md:text-lg text-branding-900">Loading...</p>
                    <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No sales data by day of month.</p>
            ) : (
                <div className="h-[400px] overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: xTickFontSize }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value: number) => [`${value}`, "Sales"]} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#007aa5"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            >
                                <LabelList dataKey="count" position="top" formatter={(v: number) => `${v}`} />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default FrecuenciaPorMes;
