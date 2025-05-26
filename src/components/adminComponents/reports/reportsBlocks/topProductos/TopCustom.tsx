"use client";

import React, { useState } from "react";
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

const TopCustom = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const handleSearch = async () => {
    if (!from || !to || !slug || !token) return;

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
      console.error("Error fetching custom top products:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Top custom products</h3>

      {/* Filtros de fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">From:</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To:</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      </div>

      {/* Orden */}
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

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 rounded mb-6"
      >
        Search
      </button>

      {/* Resultado */}
      {loading ? (
        <p>Loading...</p>
      ) : productos.length === 0 ? (
        <p>No products sold in this range.</p>
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
            <Bar dataKey="quantity" fill="#a4de6c">
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

export default TopCustom;
