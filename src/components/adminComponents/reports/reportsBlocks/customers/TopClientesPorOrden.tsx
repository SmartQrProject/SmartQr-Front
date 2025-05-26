"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type Cliente = {
  name: string;
  orders: number;
  total: number;
};

const TopClientesPorOrden = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/customers?sortBy=orders&order=desc&limit=10&page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        setData(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        console.error("Error fetching top customers:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Top 10 customers by number of orders
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 50, left: 100, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                width={150}
              />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "orders"
                    ? [`${value}`, "Orders"]
                    : [`$${value.toFixed(2)}`, "Total spent"]
                }
              />
              <Bar dataKey="orders" fill="#8884d8">
                <LabelList
                  dataKey="total"
                  position="right"
                  formatter={(v: number) => `$${v.toFixed(2)}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopClientesPorOrden;
