"use client";

import { useState, useEffect } from "react";
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
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Sales by Category (Custom)
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="mr-2">From:</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">To:</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="mr-2">Order:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="border px-2 py-1 rounded"
          >
            <option value="desc">Best Sellers</option>
            <option value="asc">Least Sold</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : categorias.length === 0 && from && to ? (
        <p>No sales in this range.</p>
      ) : (
        <>
          {/* Charts */}
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
                      formatter={(v: number) => `${v} units`}
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

          {/* Detailed table */}
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

export default CategoriaCustom;
