"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

type Cliente = {
  id: string;
  createdAt: string;
};

type ClienteNuevoPorMes = {
  month: string; // Ej: "mayo 2025"
  count: number;
};

const ClientesNuevosPorMes = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const [data, setData] = useState<ClienteNuevoPorMes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/customers?sortBy=createdAt&order=asc&limit=1000&page=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        const clientes: Cliente[] = json.data || [];

        // Agrupar por mes (ej: "mayo 2025")
        const grouped: Record<string, number> = {};

        clientes.forEach((cliente) => {
          const fecha = dayjs(cliente.createdAt);
          const mes = fecha.format("MMMM YYYY");
          grouped[mes] = (grouped[mes] || 0) + 1;
        });

        const formatted: ClienteNuevoPorMes[] = Object.entries(grouped)
          .map(([month, count]) => ({ month, count }))
          .sort(
            (a, b) =>
              dayjs(a.month, "MMMM YYYY").toDate().getTime() -
              dayjs(b.month, "MMMM YYYY").toDate().getTime()
          );

        setData(formatted);
      } catch (err) {
        console.error("Error al obtener clientes nuevos por mes:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Clientes nuevos por mes</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hay registros de clientes nuevos.</p>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => [`${value}`, "Clientes nuevos"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(v: number) => `${v}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ClientesNuevosPorMes;
