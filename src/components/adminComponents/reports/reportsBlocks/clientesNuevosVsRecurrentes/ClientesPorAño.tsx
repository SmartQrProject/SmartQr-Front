"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ClientesPorAño = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [data, setData] = useState<{
    newCustomers: number;
    returningCustomers: number;
    newPercentage: number;
    returningPercentage: number;
  } | null>(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const from = dayjs().subtract(1, "year").format("YYYY-MM-DD");
  const to = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/customer-types?from=${from}&to=${to}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const result = await res.json();
        setData(result);
        setError(false);
      } catch (err) {
        setError(true);
        console.error("Error al obtener datos de clientes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);

  if (loading) return <p>Cargando...</p>;
  if (error || !data) return <p>Hubo un problema al cargar los datos.</p>;
  if (data.newCustomers + data.returningCustomers === 0)
    return <p>No hubo clientes en este año.</p>;

  const chartData = [
    {
      name: "Nuevos",
      value: data.newCustomers,
    },
    {
      name: "Recurrentes",
      value: data.returningCustomers,
    },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="space-y-4">
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <h3 className="text-lg font-semibold">Clientes Nuevos</h3>
          <p className="text-2xl">{data.newCustomers}</p>
          <p className="text-gray-500">{data.newPercentage.toFixed(1)}%</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <h3 className="text-lg font-semibold">Clientes Recurrentes</h3>
          <p className="text-2xl">{data.returningCustomers}</p>
          <p className="text-gray-500">
            {data.returningPercentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientesPorAño;
