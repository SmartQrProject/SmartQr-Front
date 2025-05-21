"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import dayjs from "dayjs";

const VentasPorMes = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
  const end = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!slug || !token) return;
    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const fetchTotal = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales?from=${start}&to=${end}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setTotal(data.total ?? 0);
      } catch (err) {
        console.error("Error al obtener ventas del mes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [slug, token, start, end]);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <p>
            Ventas desde el <strong>{start}</strong> hasta el{" "}
            <strong>{end}</strong>
          </p>
          <p>
            Total del mes: <strong>${total?.toFixed(2)}</strong>
          </p>
        </>
      )}
    </div>
  );
};

export default VentasPorMes;
