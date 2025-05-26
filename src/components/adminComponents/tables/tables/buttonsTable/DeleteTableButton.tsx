"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
    tableId: string;
    onTableDeleted: () => void;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const DeleteTableButton: React.FC<Props> = ({ tableId, onTableDeleted }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!APIURL) {
            toast.error("API URL is not defined");
            return;
        }

        try {
            setLoading(true);

            const session = localStorage.getItem("adminSession");
            if (!session) throw new Error("Session not found");

            const parsed = JSON.parse(session);
            const token = parsed.token;
            const slug = parsed.restaurant?.slug || parsed.payload?.restaurant?.slug;

            const res = await fetch(`${APIURL}/${slug}/restaurant-tables/${tableId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            toast.success("Table deleted successfully");
            setShowConfirm(false);
            onTableDeleted();
        } catch (err: any) {
            toast.error("Delete failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button title="Delete table" onClick={() => setShowConfirm(true)} className="p-1 rounded hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4 text-gray-500" />
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
                        <p className="text-sm text-gray-600 mb-6">This action will permanently delete the table.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteTableButton;
