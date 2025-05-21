"use client";

import React, { useState, useRef } from "react";
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

const VentasCustom = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;
  const chartRef = useRef(null);

  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [metaPersonalizada, setMetaPersonalizada] = useState(5000);
  const [hoverY, setHoverY] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!from || !to || !slug || !token) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${APIURL}/${slug}/reports/sales?from=${from}&to=${to}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      const total = result.total ?? 0;
      setTotal(total);
      setData([{ name: "Rango personalizado", total }]);
    } catch (err) {
      console.error("Error al obtener ventas personalizadas:", err);
      setTotal(null);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={chartRef} className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Ventas personalizadas</h3>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Desde:</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Hasta:</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Consultar
      </button>

      {/* 🎯 Input + info complementaria */}
      {total !== null && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Meta para este rango ($):
            </label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full max-w-xs"
              value={metaPersonalizada}
              onChange={(e) => setMetaPersonalizada(Number(e.target.value))}
            />
          </div>

          <div className="mt-2 sm:mt-6 text-sm text-gray-700">
            <p>
              Falta:{" "}
              <strong>
                ${Math.max(metaPersonalizada - total, 0).toFixed(2)}
              </strong>
            </p>
            <p>
              Progreso:{" "}
              <strong
                className={
                  total >= metaPersonalizada
                    ? "text-green-600"
                    : total >= metaPersonalizada * 0.5
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {Math.min((total / metaPersonalizada) * 100 || 0, 100).toFixed(
                  1
                )}
                %
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* 🔒 Futuro: carga de meta desde el backend */}
      {/*
      useEffect(() => {
        const fetchMeta = async () => {
          const res = await fetch(`${APIURL}/restaurants?slug=test-cafe`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          setMetaPersonalizada(json.meta_custom); // <-- cargar desde backend
        };
        fetchMeta();
      }, []);
      */}

      <div className="mt-6">
        {loading ? (
          <p>Cargando...</p>
        ) : total !== null ? (
          <>
            <p className="mb-2">
              Ventas desde el <strong>{from}</strong> hasta el{" "}
              <strong>{to}</strong>
            </p>
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
                <YAxis domain={[0, Math.max(metaPersonalizada, total) + 400]} />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Ventas",
                  ]}
                />
                <ReferenceLine
                  y={metaPersonalizada}
                  stroke="red"
                  strokeDasharray="4 4"
                  label={{
                    value: `Meta: $${metaPersonalizada}`,
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
                <Bar dataKey="total" fill="#a4de6c" animationDuration={700}>
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={(v: number) => `$${v}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p>Seleccioná un rango de fechas y consultá.</p>
        )}
      </div>
    </div>
  );
};

export default VentasCustom;
