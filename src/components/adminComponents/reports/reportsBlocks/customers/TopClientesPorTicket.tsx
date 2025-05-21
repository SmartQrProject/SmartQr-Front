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
  averageOrder: number;
  orders: number;
};

const TopClientesPorTicket = () => {
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
          `${APIURL}/${slug}/reports/customers?sortBy=averageOrder&order=desc&limit=10&page=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        setData(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Error al obtener top clientes por ticket:", err);
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
        Top 10 clientes por ticket promedio
      </h3>

      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 50, left: 100, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === "averageOrder"
                    ? [`$${value.toFixed(2)}`, "Promedio por orden"]
                    : [`${value}`, "Órdenes"]
                }
              />
              <Bar dataKey="averageOrder" fill="#ffc658">
                <LabelList
                  dataKey="orders"
                  position="right"
                  formatter={(v: number) => `${v} ord`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopClientesPorTicket;
