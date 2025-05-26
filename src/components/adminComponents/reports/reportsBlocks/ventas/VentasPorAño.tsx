"use client";

import React, { useEffect, useRef, useState } from "react";
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

const VentasPorAño = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const chartRef = useRef(null);

  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaAnual, setMetaAnual] = useState(20000); // Meta anual provisoria
  const [hoverY, setHoverY] = useState<number | null>(null);

  const start = dayjs().startOf("year").format("YYYY-MM-DD");
  const end = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchTotal = async () => {
      if (!slug || !token) return;
      const APIURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales?from=${start}&to=${end}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        const total = result.total ?? 0;
        setData([{ name: "Current Year", total }]);
      } catch (err) {
        console.error("Error fetching yearly sales:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [slug, token, start, end]);

  return (
    <div ref={chartRef} className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Yearly Sales</h3>
      <p className="text-sm mb-2">
        From <strong>{start}</strong> to <strong>{end}</strong>
      </p>

      {/* Target input + complementary info */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Provisional yearly target ($):
          </label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full max-w-xs"
            value={metaAnual}
            onChange={(e) => setMetaAnual(Number(e.target.value))}
          />
        </div>

        {/* Progress info */}
        {data.length > 0 && (
          <div className="mt-2 sm:mt-6 text-sm text-gray-700">
            <p>
              Remaining:{" "}
              <strong>
                ${Math.max(metaAnual - data[0].total, 0).toFixed(2)}
              </strong>
            </p>
            <p>
              Progress:{" "}
              <strong
                className={
                  data[0].total >= metaAnual
                    ? "text-green-600"
                    : data[0].total >= metaAnual * 0.5
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {Math.min((data[0].total / metaAnual) * 100 || 0, 100).toFixed(
                  1
                )}
                %
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Future: load from backend */}

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No sales this year.</p>
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
            <YAxis domain={[0, Math.max(metaAnual, data[0].total) + 1500]} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
            />

            <ReferenceLine
              y={metaAnual}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: `Target: $${metaAnual}`,
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

export default VentasPorAño;
