"use client";

import React, { useEffect, useState } from "react";
import Table from "./Table";
import { ITables } from "@/types";
import Link from "next/link";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const TableList: React.FC = () => {
    const [tables, setTables] = useState<ITables[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            console.log("🔄 Starting fetchTables...");

            const session = localStorage.getItem("adminSession");
            if (!session) {
                setError("No session found.");
                return;
            }

            try {
                const parsed = JSON.parse(session);
                console.log("✅ Parsed session:", parsed);

                const token = parsed.token;
                const slug = parsed.payload?.slug;

                if (!token || !slug) {
                    setError("Invalid session data.");
                    return;
                }

                console.log("📡 Calling:", `${APIURL}/restaurant-tables/${slug}`);

                const res = await fetch(`${APIURL}/${slug}/restaurant-tables`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Server error: ${text}`);
                }

                const json = await res.json();
                console.log("📦 Response JSON:", json);

                const allTables: ITables[] = json.restaurantTables || [];

                const filtered = allTables.filter((table) => table.exist);
                setTables(filtered);
            } catch (err: any) {
                setError(err.message || "Unexpected error");
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    if (loading) return <p className="text-center">Loading tables...</p>;
    if (error) return <p className="text-center text-red-600">Error: {error}</p>;

    return (
        <div className="mx-auto px-4 py-8 m-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => (
                    <Link key={table.id} href={`/tables/${table.id}`}>
                        <Table {...table} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TableList;
