"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

type PuntoMes = {
  label: string; // "1"..."31"
  count: number;
};

const FrecuenciaPorMes = () => {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const token = user?.token;

  const [data, setData] = useState<PuntoMes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !token) return;

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const diasEnMes = dayjs().daysInMonth(); // 28–31 según el mes actual

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APIURL}/${slug}/reports/sales-frequency?group=monthday`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        if (Array.isArray(json)) {
          // Convertir array a objeto para completar días faltantes
          const mapa = new Map<string, number>();
          json.forEach((item) => {
            mapa.set(item.label, item.count);
          });

          const completos: PuntoMes[] = [];
          for (let i = 1; i <= diasEnMes; i++) {
            const key = i.toString();
            completos.push({
              label: key,
              count: mapa.get(key) || 0,
            });
          }

          setData(completos);
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
        <p>No hay datos de ventas por día del mes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Día del mes</th>
                <th className="px-4 py-2">Cantidad de ventas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((dia, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{dia.label}</td>
                  <td className="px-4 py-2">{dia.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FrecuenciaPorMes;
