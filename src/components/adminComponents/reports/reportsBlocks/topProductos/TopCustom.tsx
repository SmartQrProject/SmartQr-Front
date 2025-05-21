"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

const TopCustom = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!slug || !token || !from || !to) return;

    setLoading(true);
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(
        `${APIURL}/${slug}/reports/topProducts?from=${from}&to=${to}&sort=${sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos personalizados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from && to) handleFetch();
  }, [from, to, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div>
          <label className="font-medium mr-2">Desde:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="font-medium mr-2">Hasta:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="font-medium mr-2">Orden:</label>
          <select
            className="border px-2 py-1 rounded"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Más vendidos</option>
            <option value="asc">Menos vendidos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : productos.length === 0 && from && to ? (
        <p>No hubo productos vendidos en el rango seleccionado.</p>
      ) : (
        <ul className="space-y-1">
          {productos.map((p: any, index: number) => (
            <li key={index}>
              {p.name}: <strong>{p.quantity}</strong> vendidos
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopCustom;
