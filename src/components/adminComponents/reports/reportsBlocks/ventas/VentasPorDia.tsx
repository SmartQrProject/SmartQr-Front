"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  ReferenceLine,
} from "recharts";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const VentasPorDia = ({
  exportRef,
}: {
  exportRef?: React.MutableRefObject<any>;
}) => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const chartRef = useRef(null);

  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaDiaria, setMetaDiaria] = useState(200); // Meta diaria provisoria
  const [hoverY, setHoverY] = useState<number | null>(null); // Y donde está el mouse

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (exportRef) exportRef.current = chartRef.current;
  }, [exportRef]);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !token) return;
      const APIURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales?from=${today}&to=${today}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        setData([{ name: today, total: json.total || 0 }]);
      } catch (err) {
        console.error("Error fetching daily sales:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token, today]);

  return (
    <div ref={chartRef} className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Daily Sales</h3>
      <p className="text-sm mb-2">
        From <strong>{today}</strong> to <strong>{today}</strong>
      </p>

      {/* Target input + complementary info */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Provisional daily target ($):
          </label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full max-w-xs"
            value={metaDiaria}
            onChange={(e) => setMetaDiaria(Number(e.target.value))}
          />
        </div>

        {/* Progress info */}
        {data.length > 0 && (
          <div className="mt-2 sm:mt-6 text-sm text-gray-700">
            <p>
              Remaining:{" "}
              <strong>
                ${Math.max(metaDiaria - data[0].total, 0).toFixed(2)}
              </strong>
            </p>
            <p>
              Progress:{" "}
              <strong
                className={
                  data[0].total >= metaDiaria
                    ? "text-green-600"
                    : data[0].total >= metaDiaria * 0.5
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {Math.min((data[0].total / metaDiaria) * 100 || 0, 100).toFixed(
                  1
                )}
                %
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* 🔒 Futuro: este input se completará automáticamente con el fetch al restaurante */}
      {/* 
      useEffect(() => {
        const fetchMeta = async () => {
          const res = await fetch(`${APIURL}/restaurants?slug=test-cafe`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          setMetaDiaria(json.meta); // <-- aquí seteás la meta desde el back
        };
        fetchMeta();
      }, []);
      */}

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No sales recorded today.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            onMouseMove={(e: any) => {
              if (e?.activeCoordinate?.yValue != null) {
                setHoverY(e.activeCoordinate.yValue);
              }
            }}
            onMouseLeave={() => setHoverY(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, Math.max(metaDiaria, data[0].total) + 50]} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
            />

            <ReferenceLine
              y={metaDiaria}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: `Target: $${metaDiaria}`,
                position: "top",
                fill: "red",
                fontSize: 12,
              }}
            />

            {hoverY !== null && (
              <ReferenceLine
                y={hoverY}
                stroke="gray"
                strokeDasharray="2 2"
                ifOverflow="extendDomain"
              />
            )}

            <Bar dataKey="total" fill="#8884d8" animationDuration={700}>
              <LabelList
                dataKey="total"
                position="top"
                formatter={(v: number) => `$${v}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default VentasPorDia;
