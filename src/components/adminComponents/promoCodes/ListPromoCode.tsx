"use client";

import { useEffect, useState } from "react";
import { getPromoCodes, deletePromoCodes } from "./fetch";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../menu/menuHelpers/confirm/confirmDialog";

type PromoCode = {
  code: string;
  percentage: number;
  isActive: boolean;
  id: string;
};

const PromoCodesList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<PromoCode | null>(null);

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

  const fetchPromoCodes = async () => {
    if (!slug || !token) return;
    setLoading(true);
    try {
      const response = await getPromoCodes(slug, token);
      setCodes(response || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching promo codes:", err);
      setError("Failed to load promo codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, [refreshTrigger]);

  const promptDelete = (promo: PromoCode) => {
    setPromoToDelete(promo);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!promoToDelete || !slug || !token) return;

    setDeletingId(promoToDelete.id);
    try {
      const result = await deletePromoCodes(token, promoToDelete.id, slug);
      if (result.success) {
        toast.success("Promo code deleted");
        await fetchPromoCodes();
      } else {
        toast.error(result.message || "Failed to delete promo code");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error deleting promo code");
    } finally {
      setDeletingId(null);
      setPromoToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

  const activeCodes = codes.filter((c) => c.isActive);
  const inactiveCodes = codes.filter((c) => !c.isActive);

  const renderPromoItem = (promo: PromoCode, color: "green" | "red") => (
    <li
      key={promo.id}
      className={`border border-${color}-300 bg-${color}-50 text-${color}-800 px-4 py-2 rounded-md flex justify-between items-center`}
    >
      <strong>{promo.code}</strong>
      <span className="ml-32">{promo.percentage}%</span>
      <button
        onClick={() => promptDelete(promo)}
        disabled={deletingId === promo.id}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </li>
  );

  if (loading) {
    return (
      <div className="flex gap-4 justify-center items-center h-40">
        <p className="text-sm md:text-2xl text-branding-900">Loading Promo Codes...</p>
        <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 space-y-6">

      <div>
        <button
          onClick={() => setShowActive(!showActive)}
          className="w-full flex justify-between items-center px-4 py-2 bg-green-100 text-green-800 font-semibold rounded hover:bg-green-200"
        >
          Active Promo Codes
          <span>{showActive ? "▲" : "▼"}</span>
        </button>
        {showActive && (
          <ul className="space-y-2 mt-2">
            {activeCodes.length === 0 ? (
              <p className="text-sm text-gray-500">No active promo codes.</p>
            ) : (
              activeCodes.map((p) => renderPromoItem(p, "green"))
            )}
          </ul>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className="w-full flex justify-between items-center px-4 py-2 bg-red-100 text-red-800 font-semibold rounded hover:bg-red-200"
        >
          Inactive Promo Codes
          <span>{showInactive ? "▲" : "▼"}</span>
        </button>
        {showInactive && (
          <ul className="space-y-2 mt-2">
            {inactiveCodes.length === 0 ? (
              <p className="text-sm text-gray-500">No inactive promo codes.</p>
            ) : (
              inactiveCodes.map((p) => renderPromoItem(p, "red"))
            )}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="Delete Promo Code"
        message={`Are you sure you want to delete the code "${promoToDelete?.code}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setPromoToDelete(null);
        }}
      />
    </div>
  );
};

export default PromoCodesList;
