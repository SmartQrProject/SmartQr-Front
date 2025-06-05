"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

// Responsive width hook
function useWindowWidth() {
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
}

const TopCustom = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const screenWidth = useWindowWidth();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<"asc" | "desc">("desc");

    const handleSearch = async () => {
        if (!from || !to || !slug || !token) return;

        setLoading(true);
        const APIURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(
                `${APIURL}/${slug}/reports/topProducts?from=${from}&to=${to}&sort=${sort}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            const parsed = data.map((item: any) => ({
                ...item,
                quantity: Number(item.quantity),
            }));
            setProductos(parsed);
        } catch (err) {
            console.error("Error fetching custom top products:", err);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-left sm:text-center">
                Top custom products
            </h3>
            <div className="mb-6 flex justify-center sm:justify-start">
                <select
                    className="border border-gray-300 px-4 py-2 rounded-full text-sm font-medium max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                >
                    <option value="desc">Best Sellers</option>
                    <option value="asc">Least Sold</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">From:</label>
                    <input
                        type="date"
                        className="border p-2 rounded text-sm"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">To:</label>
                    <input
                        type="date"
                        className="border p-2 rounded text-sm"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>
            </div>


            <div className="text-center sm:text-left">
                <button
                    onClick={handleSearch}
                    className="bg-branding-500 text-white px-4 py-2 rounded-full text-sm"
                >
                    Search
                </button>
            </div>

            <div className="mt-6">
                {loading ? (
                    <p className="text-sm text-gray-500 text-center">Loading...</p>
                ) : productos.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                        No products sold in this range.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={50 * productos.length}>
                        <BarChart
                            layout="vertical"
                            data={productos}
                            margin={{ top: 0, right: 40, left: 50, bottom: 0 }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis type="number" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={screenWidth && screenWidth < 640 ? 10 : 100}
                                tick={{ fontSize: screenWidth && screenWidth < 640 ? 12 : 14 }}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${value}`, "Sold"]}
                            />
                            <Bar dataKey="quantity" fill="#f28500">
                                <LabelList
                                    dataKey="quantity"
                                    stroke="black"
                                    position="right"
                                    formatter={(v: number) => `${v}`}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default TopCustom;
