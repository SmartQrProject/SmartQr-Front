"use client";

import { useEffect, useState } from "react";
import { getPromoCodes, deletePromoCodes } from "./fetch";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type PromoCode = {
    code: string;
    percentage: number;
    isActive: boolean;
    id: string;
};

const PromoCodesList = ({ refreshTrigger }: { refreshTrigger: number }) => {
    const [error, setError] = useState<string | null>(null);
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showActive, setShowActive] = useState(false);
    const [showInactive, setShowInactive] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { slug, token } = (() => {
        try {
            const session = localStorage.getItem("adminSession");
            if (!session) return { slug: "", token: "" };
            const parsed = JSON.parse(session);
            return { slug: parsed.payload?.slug || "", token: parsed.token || "" };
        } catch {
            return { slug: "", token: "" };
        }
    })();

    const handleGetPromoCodes = async () => {
        if (!slug || !token) return;
        setLoading(true);
        try {
            const response = await getPromoCodes(slug, token);
            setCodes(response || []);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching promo codes:", err);
            setError("Failed to load promo codes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetPromoCodes();
    }, [refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!slug || !token) return;

        if (!confirm("Are you sure you want to delete this promo code?")) return;

        setDeletingId(id);
        try {
            const result = await deletePromoCodes(token, id, slug);
            if (result.success) {
                await handleGetPromoCodes();
            } else {
                toast.error(result.message || "Failed to delete promo code.");
            }
        } catch (error) {
            toast.error("Unexpected error while deleting the promo code.");
        } finally {
            setDeletingId(null);
        }
    };

    const activeCodes = codes.filter((promo) => promo.isActive);
    const inactiveCodes = codes.filter((promo) => !promo.isActive);

    if (loading) return <p className="text-gray-600">Loading promo codes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-6 space-y-6">
            <div>
                <button
                    onClick={() => setShowActive(!showActive)}
                    className="w-full flex justify-between items-center px-4 py-2 bg-green-100 text-green-800 font-semibold rounded hover:bg-green-200 transition"
                >
                    Active Promo Codes
                    <span>{showActive ? "▲" : "▼"}</span>
                </button>

                {showActive && (
                    <div className="mt-2">
                        {activeCodes.length === 0 ? (
                            <p className="text-sm text-gray-500">No active promo codes.</p>
                        ) : (
                            <ul className="space-y-2 mt-2">
                                {activeCodes.map((promo) => (
                                    <li key={promo.id} className="border border-green-300 bg-green-50 text-green-800 px-4 py-2 rounded-md flex justify-between items-center">
                                        <div>
                                            <strong>{promo.code}</strong>
                                        </div>
                                        <div>
                                            <span className="ml-32">{promo.percentage}%</span>
                                        </div>
                                        <button onClick={() => handleDelete(promo.id)} disabled={deletingId === promo.id} className="text-red-500 hover:text-red-700 mt-2 sm:mt-0">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="w-full flex justify-between items-center px-4 py-2 bg-red-100 text-red-800 font-semibold rounded hover:bg-red-200 transition"
                >
                    Inactive Promo Codes
                    <span>{showInactive ? "▲" : "▼"}</span>
                </button>

                {showInactive && (
                    <div className="mt-2">
                        {inactiveCodes.length === 0 ? (
                            <p className="text-sm text-gray-500">No inactive promo codes.</p>
                        ) : (
                            <ul className="space-y-2 mt-2">
                                {inactiveCodes.map((promo) => (
                                    <li key={promo.id} className="border border-red-300 bg-red-50 text-red-800 px-4 py-2 rounded-md flex justify-between items-center">
                                        <div>
                                            <strong>{promo.code}</strong>
                                        </div>
                                        <div>
                                            <span className="ml-32">{promo.percentage}%</span>
                                        </div>
                                        <button onClick={() => handleDelete(promo.id)} disabled={deletingId === promo.id} className="text-red-500 hover:text-red-700 mt-2 sm:mt-0">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromoCodesList;
