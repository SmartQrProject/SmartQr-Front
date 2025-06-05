"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

// Hook to safely access window width
function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

type Categoria = {
  category: string;
  total: number;
  percentage: number;
  quantity: number;
  average_price: number;
};

const COLORS = [
  "#4E79A7", "#F28E2B", "#E15759", "#76B7B2",
  "#59A14F", "#EDC948", "#B07AA1", "#FF9DA7",
  "#9C755F", "#BAB0AC", "#86BCB6", "#FABFD2",
];

const CategoriaPorDia = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const screenWidth = useWindowWidth();
  const isReady = screenWidth !== null;
  const yAxisWidth = screenWidth && screenWidth < 500 ? 30 : 100;
  const yAxisFontSize = screenWidth && screenWidth < 500 ? 11 : 12;

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-by-category?from=${today}&to=${today}&sort=${sort}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Respuesta no OK:", res.status);
          setCategorias([]);
          return;
        }

        const data = await res.json();
        setCategorias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al obtener reporte por categoría:", err);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sort]);

  if (!isReady) {
    return (
      <div className="flex gap-4 justify-center items-center h-40">
        <p className="text-sm md:text-lg text-branding-900">Preparing layout...</p>
        <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Sales by Category (Day)</h3>
      <p className="text-sm mb-6 text-center">
        Date: <strong>{today}</strong>
      </p>

      <div className="mb-6 flex justify-center sm:justify-start">
        <select
          className="border px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-branding-500"
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Best Sellers</option>
          <option value="asc">Least Sold</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 text-center">Loading...</p>
      ) : categorias.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No sales by category today.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={categorias} margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={yAxisWidth}
                    tick={{ fontSize: yAxisFontSize }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "total") return [`$${value.toFixed(2)}`, "Total sold"];
                      if (name === "quantity") return [`${value}`, "Quantity"];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="total" fill={COLORS[0]}>
                    <LabelList dataKey="quantity" position="right" formatter={(v: number) => `${v} units`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorias}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {categorias.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Percentage"]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Total Sold</th>
                  <th className="px-4 py-2">% of Total</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Average</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat, i) => (
                  <tr key={i} className="border-t border-gray-200">
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
        </>
      )}
    </div>
  );
};

export default CategoriaPorDia;
