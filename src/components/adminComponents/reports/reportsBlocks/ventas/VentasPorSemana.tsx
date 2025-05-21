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

const VentasPorSemana = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const chartRef = useRef(null);

  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaSemanal, setMetaSemanal] = useState(1000); // Meta semanal provisoria
  const [hoverY, setHoverY] = useState<number | null>(null);

  const start = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"); // lunes
  const end = dayjs().format("YYYY-MM-DD"); // hoy

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
        setData([{ name: "Semana actual", total }]);
      } catch (err) {
        console.error("Error al obtener ventas de la semana:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [slug, token, start, end]);

  return (
    <div ref={chartRef} className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Ventas de la semana</h3>
      <p className="text-sm mb-2">
        Desde el <strong>{start}</strong> hasta el <strong>{end}</strong>
      </p>

      {/* 🎯 Input + info complementaria */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Meta semanal provisional ($):
          </label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-full max-w-xs"
            value={metaSemanal}
            onChange={(e) => setMetaSemanal(Number(e.target.value))}
          />
        </div>

        {/* 🔢 Info de cuánto falta y % completado */}
        {data.length > 0 && (
          <div className="mt-2 sm:mt-6 text-sm text-gray-700">
            <p>
              Falta:{" "}
              <strong>
                ${Math.max(metaSemanal - data[0].total, 0).toFixed(2)}
              </strong>
            </p>
            <p>
              Progreso:{" "}
              <strong
                className={
                  data[0].total >= metaSemanal
                    ? "text-green-600"
                    : data[0].total >= metaSemanal * 0.5
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {Math.min(
                  (data[0].total / metaSemanal) * 100 || 0,
                  100
                ).toFixed(1)}
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
          setMetaSemanal(json.meta_semanal); // <-- aquí seteás la meta desde el back
        };
        fetchMeta();
      }, []);
      */}

      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hubo ventas esta semana.</p>
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
            <YAxis domain={[0, Math.max(metaSemanal, data[0].total) + 50]} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Ventas"]}
            />

            <ReferenceLine
              y={metaSemanal}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: `Meta: $${metaSemanal}`,
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

            <Bar dataKey="total" fill="#82ca9d" animationDuration={700}>
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

export default VentasPorSemana;
