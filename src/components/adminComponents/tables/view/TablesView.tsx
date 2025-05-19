"use client";

import React, { useEffect, useState } from "react";
import TableSeederForm from "../tables/TableSeederForm";
import TableList from "../tables/TableList";
import { ITables } from "@/types";
import { toast } from "react-hot-toast";

const TablesView: React.FC = () => {
    const [slug, setSlug] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [tables, setTables] = useState<ITables[]>([]);
    const [loading, setLoading] = useState(true);
    const urlback = process.env.NEXT_PUBLIC_API_URL || "";

    const fetchTables = async (slug: string, token: string) => {
        try {
            const res = await fetch(`${urlback}/${slug}/restaurant-tables?page=1&limit=999`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch tables");

            const json = await res.json();
            const allTables: ITables[] = json.restaurantTables || [];
            const filtered = allTables.filter((table) => table.exist);
            setTables(filtered);
        } catch (err) {
            toast.error("Error loading tables");
            console.error("Error in fetchTables:", err);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const sessionRaw = localStorage.getItem("adminSession");
            if (sessionRaw) {
                try {
                    const session = JSON.parse(sessionRaw);
                    const extractedToken = session.token;
                    const extractedSlug = session.restaurant?.slug || session.payload?.restaurant?.slug;

                    if (extractedToken && extractedSlug) {
                        setSlug(extractedSlug);
                        setToken(extractedToken);
                        fetchTables(extractedSlug, extractedToken);
                    }
                } catch (error) {
                    toast.error("Invalid session data");
                    console.error("Error parsing session:", error);
                }
            }
            setLoading(false);
        }
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-600">Loading session data...</p>;

    if (!slug || !token) {
        return <p className="text-center mt-10 text-red-600">Unable to retrieve token or slug. Please check login.</p>;
    }

    return (
        <div className="px-4">
            <TableSeederForm slug={slug} urlback={urlback} token={token} onTablesUpdated={() => fetchTables(slug, token)} />
            <TableList tables={tables} onTableDeleted={() => fetchTables(slug, token)} onTableEdited={() => fetchTables(slug, token)} />
        </div>
    );
};

export default TablesView;
