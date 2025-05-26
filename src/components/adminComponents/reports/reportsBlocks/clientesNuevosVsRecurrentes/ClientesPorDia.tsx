"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ClientesPorDia = () => {
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

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const today = dayjs().format("YYYY-MM-DD");

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/customer-types?from=${today}&to=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res);
        if (!res.ok) throw new Error("Server response error");

        const result = await res.json();
        setData(result);
        setError(false);
      } catch (err) {
        setError(true);
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>There was a problem loading the data.</p>;
  if (data.newCustomers + data.returningCustomers === 0)
    return <p>No customers today.</p>;

  const chartData = [
    {
      name: "New",
      value: data.newCustomers,
    },
    {
      name: "Returning",
      value: data.returningCustomers,
    },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="space-y-4">
      {/* Donut Chart */}
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

      {/* Cuadros de valores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <h3 className="text-lg font-semibold">New Customers</h3>
          <p className="text-2xl">{data.newCustomers}</p>
          <p className="text-gray-500">{data.newPercentage.toFixed(1)}%</p>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <h3 className="text-lg font-semibold">Returning Customers</h3>
          <p className="text-2xl">{data.returningCustomers}</p>
          <p className="text-gray-500">
            {data.returningPercentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientesPorDia;
