"use client";

import { useEffect, useState } from "react";
import IndexClientesVisual from "./IndexClientesVisual";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const LIMIT_OPTIONS = [10, 20, 30, 40, 50];

const Customers = () => {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [customers, setCustomers] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState("orders");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${APIURL}/${slug}/reports/customers?sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await res.json();
                if (json?.data) {
                    setCustomers(json.data);
                    setTotal(json.total);
                } else {
                    setCustomers([]);
                    setTotal(0);
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
                setCustomers([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, token, sortBy, order, limit, page]);

    const totalPages = Math.ceil(total / limit);

    const toggleOrder = (column: string) => {
        if (sortBy === column) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setOrder("desc");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-7xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">Customers</h2>

            <div className="mb-8">
                <IndexClientesVisual />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <label className="text-sm">Customers per page:</label>
                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="border px-4 py-2 rounded-full text-sm w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
                >
                    {LIMIT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex gap-4 justify-center items-center h-40">
                    <p className="text-sm md:text-lg text-branding-900">Loading...</p>
                    <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : customers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No customers to display.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                {[
                                    ["Name", "name"],
                                    ["Email", "email"],
                                    ["Orders", "orders"],
                                    ["Total", "totalSpent"],
                                    ["Average", "averageOrder"],
                                    ["Since", "createdAt"],
                                    ["Last Visit", "lastVisit"],
                                    ["Days Since Visit", "daysSince"],
                                ].map(([label, key]) => (
                                    <th key={key} className="px-4 py-2 cursor-pointer hover:underline" onClick={() => toggleOrder(key)}>
                                        {label} {sortBy === key ? (order === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, i) => (
                                <tr key={i} className="border-t border-gray-200">
                                    <td className="px-4 py-2">{c.name}</td>
                                    <td className="px-4 py-2">{c.email}</td>
                                    <td className="px-4 py-2">{c.orders}</td>
                                    <td className="px-4 py-2">${c.totalSpent.toFixed(2)}</td>
                                    <td className="px-4 py-2">${c.averageOrder.toFixed(2)}</td>
                                    <td className="px-4 py-2">{dayjs(c.createdAt).format("YYYY-MM-DD")}</td>
                                    <td className="px-4 py-2">{dayjs(c.lastVisit).format("YYYY-MM-DD")}</td>
                                    <td className="px-4 py-2">{c.daysSince} days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-4 py-2 border rounded-full text-sm disabled:opacity-50" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                </button>
                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>
                <button className="px-4 py-2 border rounded-full text-sm disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Customers;
