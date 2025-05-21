"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const TopPorSemana = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const to = dayjs().format("YYYY-MM-DD");
    const from = dayjs().startOf("week").add(-6, "day").format("YYYY-MM-DD"); // lunes anterior

    const fetchData = async () => {
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
        console.error("Error al obtener top productos de la semana:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sort]);

  return (
    <div>
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
        <p>No hubo productos vendidos esta semana.</p>
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

export default TopPorSemana;
