"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface TableSeederFormProps {
    slug: string;
    urlback: string;
    token: string;
    onTablesUpdated: () => void;
}

const TableSeederForm: React.FC<TableSeederFormProps> = ({ slug, urlback, token, onTablesUpdated }) => {
    const [count, setCount] = useState("");
    const [prefix, setPrefix] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!count || !prefix) {
            toast.error("Please fill out both fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${urlback}/${slug}/restaurant-tables/seeder/${count}/${prefix}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success("Tables created successfully.");
                setCount("");
                setPrefix("");
                onTablesUpdated();
            } else {
                toast.error("Failed to create tables.");
            }
        } catch (error) {
            toast.error("Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6 bg-white rounded-xl shadow p-6 w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="number"
                    placeholder="Number of tables"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
                />
                <input
                    type="text"
                    placeholder="Table prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
                />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
                    {loading ? "Creating..." : "Create tables"}
                </button>
            </form>
        </div>
    );
};

export default TableSeederForm;
