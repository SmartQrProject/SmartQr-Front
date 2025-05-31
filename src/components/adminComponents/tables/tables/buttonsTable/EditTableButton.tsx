"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
    tableId: string;
    currentCode: string;
    isActive: boolean;
    onTableEdited: () => void;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const EditTableButton: React.FC<Props> = ({ tableId, currentCode, isActive, onTableEdited }) => {
    const [showModal, setShowModal] = useState(false);
    const [newCode, setNewCode] = useState(currentCode);
    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        if (!APIURL || !newCode) return;

        if (!/^[A-Za-z0-9 -]{1,15}$/.test(newCode)) {
            toast.error("The table name must be between 1 and 15 characters and can only contain letters, numbers, spaces and dashes.");
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
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ code: newCode.trim(), is_active: isActive, exist: true }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            toast.success("Table updated successfully");
            setShowModal(false);
            onTableEdited();
        } catch (err: any) {
            toast.error("Update failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button title="Edit table" onClick={() => setShowModal(true)} className="p-1 rounded hover:bg-blue-100 transition">
                <Pencil className="w-4 h-4 text-gray-500" />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold mb-4">Edit table name</h3>
                        <input
                            type="text"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                            placeholder="New table code"
                        />
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
                                Cancel
                            </button>
                            <button onClick={handleEdit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditTableButton;
