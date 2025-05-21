"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type Categoria = {
  category: string;
  total: number;
  percentage: number;
  quantity: number;
  average_price: number;
};

const CategoriaCustom = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!slug || !token || !from || !to) return;
    setLoading(true);
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(
        `${APIURL}/${slug}/reports/sales-by-category?from=${from}&to=${to}&sort=${sort}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategorias(data);
      } else {
        setCategorias([]);
      }
    } catch {
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from && to) fetchData();
  }, [from, to, sort]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="mr-2">Desde:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Hasta:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Orden:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="border px-2 py-1 rounded"
          >
            <option value="desc">Más vendidas</option>
            <option value="asc">Menos vendidas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : categorias.length === 0 && from && to ? (
        <p>No hubo ventas en ese rango.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Total vendido</th>
                <th className="px-4 py-2">% del total</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{cat.category}</td>
                  <td className="px-4 py-2">${cat.total.toFixed(2)}</td>
                  <td className="px-4 py-2">{cat.percentage.toFixed(1)}%</td>
                  <td className="px-4 py-2">{cat.quantity}</td>
                  <td className="px-4 py-2">${cat.average_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriaCustom;
