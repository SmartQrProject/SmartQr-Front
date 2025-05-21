"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type PuntoAño = {
  label: string; // "Enero", "Febrero", etc.
  count: number;
};

const FrecuenciaPorAño = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [data, setData] = useState<PuntoAño[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-frequency?group=month`,
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
        <p>No hay datos de ventas por mes del año.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Mes</th>
                <th className="px-4 py-2">Cantidad de ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((mes, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{mes.label}</td>
                  <td className="px-4 py-2">{mes.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FrecuenciaPorAño;
