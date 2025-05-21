"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type PuntoHora = {
  label: string; // "00"..."23"
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, token]);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hay datos de ventas por hora.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Cantidad de ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((h, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{h.label}:00</td>
                  <td className="px-4 py-2">{h.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FrecuenciaPorHora;
