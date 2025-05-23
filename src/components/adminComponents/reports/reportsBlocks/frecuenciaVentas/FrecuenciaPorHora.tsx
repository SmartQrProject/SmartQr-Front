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

type PuntoHora = {
  label: string; // "13:00", "14:00", etc.
  count: number;
};

const FrecuenciaPorHora = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [data, setData] = useState<PuntoHora[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-frequency?group=hour`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch {
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
        Frecuencia por hora del día
      </h3>

      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hay datos de ventas por hora.</p>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: number) => [`${value}`, "Ventas"]} />
              <Bar dataKey="count" fill="#8884d8">
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(v: number) => `${v}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FrecuenciaPorHora;
