"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const TopPorDia = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc"); // nuevo

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const today = dayjs().format("YYYY-MM-DD");

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/topProducts?from=${today}&to=${today}&sort=${sort}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al obtener top productos del día:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sort]); // incluye sort

  return (
    <div>
      {/* Selector de orden */}
      <div className="mb-4">
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

      {loading ? (
        <p>Cargando...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos vendidos en este día.</p>
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

export default TopPorDia;
