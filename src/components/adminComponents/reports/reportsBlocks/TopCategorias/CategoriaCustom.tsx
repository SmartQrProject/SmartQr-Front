"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, LabelList,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

// Safe screen width detection
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

type Categoria = {
    category: string;
    total: number;
    percentage: number;
    quantity: number;
    average_price: number;
};

const COLORS = [
    "#4E79A7", "#F28E2B", "#E15759", "#76B7B2",
    "#59A14F", "#EDC948", "#B07AA1", "#FF9DA7",
    "#9C755F", "#BAB0AC", "#86BCB6", "#FABFD2",
];

const CategoriaCustom = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;
    const screenWidth = useWindowWidth();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [sort, setSort] = useState<"asc" | "desc">("desc");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!slug || !token || !from || !to) return;
        setLoading(true);
        const APIURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${APIURL}/${slug}/reports/sales-by-category?from=${from}&to=${to}&sort=${sort}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setCategorias(data);
            else setCategorias([]);
        } catch {
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (from && to) fetchData();
    }, [from, to, sort]);

    const yAxisWidth = screenWidth !== null && screenWidth < 500 ? 60 : 130;
    const tickFontSize = screenWidth !== null && screenWidth < 500 ? 11 : 12;
    const showPieLabels = screenWidth !== null && screenWidth >= 500;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-left sm:text-center">Sales by Category (Custom)</h3>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div className="flex flex-col text-sm">
                    <label className="mb-1 font-medium">From:</label>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-branding-500"
                    />
                </div>
                <div className="flex flex-col text-sm">
                    <label className="mb-1 font-medium">To:</label>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-branding-500"
                    />
                </div>
                <div className="flex flex-col text-sm">
                    <label className="mb-1 font-medium">Order:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                        className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-branding-500"
                    >
                        <option value="desc">Best Sellers</option>
                        <option value="asc">Least Sold</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500 text-center">Loading...</p>
            ) : categorias.length === 0 && from && to ? (
                <p className="text-sm text-gray-500 text-center">No sales in this range.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       
                        <div className="h-[400px] overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={categorias} margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                    <XAxis type="number" />
                                    <YAxis dataKey="category" type="category" width={yAxisWidth} tick={{ fontSize: tickFontSize }} />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            if (name === "total") return [`$${value.toFixed(2)}`, "Total sold"];
                                            if (name === "quantity") return [`${value}`, "Quantity"];
                                            return [value, name];
                                        }}
                                    />
                                    <Bar dataKey="total" fill={COLORS[0]}>
                                        <LabelList dataKey="quantity" position="right" formatter={(v: number) => `${v} units`} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="h-[400px] overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorias}
                                        dataKey="percentage"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        label={showPieLabels ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)` : false}
                                    >
                                        {categorias.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Total Sold</th>
                                    <th className="px-4 py-2">% of Total</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Average</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map((cat, i) => (
                                    <tr key={i} className="border-t border-gray-200">
                                        <td className="px-4 py-2">{cat.category}</td>
                                        <td className="px-4 py-2">${cat.total.toFixed(2)}</td>
                                        <td className="px-4 py-2">{cat.percentage.toFixed(1)}%</td>
                                        <td className="px-4 py-2">{cat.quantity}</td>
                                        <td className="px-4 py-2">${cat.average_price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoriaCustom;
