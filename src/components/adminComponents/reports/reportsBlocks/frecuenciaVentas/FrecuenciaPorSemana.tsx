"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type PuntoSemana = {
  label: string; // "Lunes", "Martes", etc.
  count: number;
};

const FrecuenciaPorSemana = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [data, setData] = useState<PuntoSemana[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-frequency?group=weekday`,
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
        <p>No hay datos de ventas por día de semana.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Día</th>
                <th className="px-4 py-2">Cantidad de ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{d.label}</td>
                  <td className="px-4 py-2">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FrecuenciaPorSemana;
