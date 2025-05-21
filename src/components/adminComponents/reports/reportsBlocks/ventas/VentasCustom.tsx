"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

const VentasCustom = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!from || !to || !slug || !token) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${APIURL}/${slug}/reports/sales?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error("Error al obtener ventas personalizadas:", err);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Desde:</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Hasta:</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Consultar
      </button>

      <div className="mt-4">
        {loading ? (
          <p>Cargando...</p>
        ) : total !== null ? (
          <>
            <p>
              Ventas desde el <strong>{from}</strong> hasta el{" "}
              <strong>{to}</strong>
            </p>
            <p>
              Total: <strong>${total.toFixed(2)}</strong>
            </p>
          </>
        ) : (
          <p>Seleccioná un rango de fechas y consultá.</p>
        )}
      </div>
    </div>
  );
};

export default VentasCustom;
