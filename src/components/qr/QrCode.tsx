'use client';

import { useEffect, useState } from 'react';
import { useQRCode } from 'next-qrcode';

type Table = {
  id: string;
  name: string;
};

export default function TableQRGenerator({ slug }: { slug: string }) {
  const [tables, setTables] = useState<Table[]>([]);
  const { Canvas } = useQRCode();

  useEffect(() => {
    async function fetchTables() {
      const res = await fetch(`/api/${slug}/restaurant-tables?page=1&limit=100`);
      const json = await res.json();
      setTables(json.data || []);
    }

    fetchTables();
  }, [slug]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {tables.map((table) => (
        <div key={table.id} className="border p-4 rounded shadow text-center">
          <h3 className="font-semibold mb-2">Mesa: {table.name}</h3>
          <Canvas
            text={`https://www.smart-qr.tech/menu/${slug}?table=${table.id}`}
            options={{
              errorCorrectionLevel: 'M',
              margin: 2,
              scale: 4,
              width: 200,
              color: {
                dark: '#000000FF',
                light: '#FFFFFFFF',
              },
            }}
          />
          <p className="text-xs mt-2">{table.id}</p>
        </div>
      ))}
    </div>
  );
}
