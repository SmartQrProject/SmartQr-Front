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

type Categoria = {
  category: string;
  total: number;
  percentage: number;
  quantity: number;
  average_price: number;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
  "#83a6ed",
  "#8e4585",
  "#ffbb28",
  "#00C49F",
  "#FF8042",
];

const CategoriaPorSemana = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const start = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"); // lunes
  const end = dayjs().format("YYYY-MM-DD"); // hoy

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-by-category?from=${start}&to=${end}&sort=${sort}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Respuesta no OK:", res.status);
          setCategorias([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.error("Respuesta inesperada del servidor:", data);
          setCategorias([]);
        }
      } catch (err) {
        console.error("Error al obtener reporte por categoría:", err);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sort]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Sales by Category (Week)
      </h3>
      <p className="text-sm mb-6">
        From <strong>{start}</strong> to <strong>{end}</strong>
      </p>

      {/* Order */}
      <div className="mb-6">
        <label className="font-medium mr-2">Order:</label>
        <select
          className="border px-2 py-1 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Best Sellers</option>
          <option value="asc">Least Sold</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : categorias.length === 0 ? (
        <p>No sales by category this week.</p>
      ) : (
        <>
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* BarChart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={categorias}
                  margin={{ top: 0, right: 40, left: 80, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={130}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "total")
                        return [`$${value.toFixed(2)}`, "Total sold"];
                      if (name === "quantity") return [`${value}`, "Quantity"];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="total" fill="#8884d8">
                    <LabelList
                      dataKey="quantity"
                      position="right"
                      formatter={(v: number) => `${v} uds`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PieChart */}
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
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {categorias.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(1)}%`,
                      "Percentage",
                    ]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
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
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{cat.category}</td>
                    <td className="px-4 py-2">${cat.total.toFixed(2)}</td>
                    <td className="px-4 py-2">{cat.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-2">{cat.quantity}</td>
                    <td className="px-4 py-2">
                      ${cat.average_price.toFixed(2)}
                    </td>
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

export default CategoriaPorSemana;
