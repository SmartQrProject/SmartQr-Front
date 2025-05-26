"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const TopPorAño = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const start = dayjs().startOf("year").format("YYYY-MM-DD");
  const end = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/topProducts?from=${start}&to=${end}&sort=${sort}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error fetching top products of the year:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, sort]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Top products of the year</h3>
      <p className="text-sm mb-2">
        From <strong>{start}</strong> to <strong>{end}</strong>
      </p>

      <div className="mb-4">
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
      ) : productos.length === 0 ? (
        <p>No products sold this year.</p>
      ) : (
        <ResponsiveContainer width="100%" height={50 * productos.length}>
          <BarChart
            layout="vertical"
            data={productos}
            margin={{ top: 0, right: 40, left: 100, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value: number) => [`${value}`, "Sold"]} />
            <Bar dataKey="quantity" fill="#8884d8">
              <LabelList
                dataKey="quantity"
                position="right"
                formatter={(v: number) => `${v}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopPorAño;
