"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type Categoria = {
  category: string;
  total: number;
  percentage: number;
  quantity: number;
  average_price: number;
};

const CategoriaPorAño = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const from = dayjs().subtract(1, "year").format("YYYY-MM-DD");
    const to = dayjs().format("YYYY-MM-DD");

    const fetchData = async () => {
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
          <option value="desc">Más vendidas</option>
          <option value="asc">Menos vendidas</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : categorias.length === 0 ? (
        <p>No hubo ventas este año.</p>
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

export default CategoriaPorAño;
