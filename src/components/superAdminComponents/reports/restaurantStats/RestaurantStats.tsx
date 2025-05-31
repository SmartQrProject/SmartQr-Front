"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

interface CustomerReachEntry {
    restaurantId: string;
    restaurantName: string;
    customers: number;
}

const ITEMS_PER_PAGE = 10;

export default function CustomerReachTable() {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [customerReachData, setCustomerReachData] = useState<CustomerReachEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.ceil(customerReachData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = customerReachData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full">
            <h2 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Customer Reach per Restaurant</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100 text-sm text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left border-b">Restaurant Name</th>
                            <th className="px-4 py-2 text-left border-b">Customers</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {paginatedData.map((entry) => (
                            <tr key={entry.restaurantId} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{entry.restaurantName}</td>
                                <td className="px-4 py-2 border-b">{entry.customers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
