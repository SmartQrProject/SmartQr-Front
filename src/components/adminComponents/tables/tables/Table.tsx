"use client";

import React, { useState, useRef } from "react";
import { ITables } from "@/types";
import EditTableButton from "./../tables/buttonsTable/EditTableButton";
import DeleteTableButton from "./../tables/buttonsTable/DeleteTableButton";
import ToggleActiveSwitch from "./../tables/buttonsTable/ToggleActiveSwitch";
import { useQRCode } from "next-qrcode";

interface TableProps extends ITables {
  onTableDeleted: () => void;
  onTableEdited: () => void;
  restaurantSlug: string;
}

const Table: React.FC<TableProps> = ({
  id,
  code,
  created_at,
  is_active,
  onTableDeleted,
  onTableEdited,
  restaurantSlug,
}) => {
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const { Canvas } = useQRCode();
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const qrUrl = `${APIURL}/${restaurantSlug}?table=${id}`;

  const handlePrint = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <html>
        <head><title>QR Mesa ${code}</title></head>
        <body style="text-align:center; font-family:sans-serif;">
          <h2>Mesa ${code}</h2>
          <img src="${dataUrl}" />
          <p>${qrUrl}</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div
      className={`relative rounded-xl p-4 w-[260px] h-auto shadow-md ${
        is_active ? "bg-gray-200" : "bg-gray-100"
      }`}
    >
      <div className="absolute top-2 left-2">
        <EditTableButton
          tableId={id}
          currentCode={code}
          isActive={is_active}
          onTableEdited={onTableEdited}
        />
      </div>
      <div className="absolute top-2 right-2">
        <DeleteTableButton tableId={id} onTableDeleted={onTableDeleted} />
      </div>
      <div className="absolute bottom-2 right-2">
        <ToggleActiveSwitch
          tableId={id}
          isActive={is_active}
          onToggle={onTableEdited}
        />
      </div>

      <div className="flex items-center gap-4 h-[80px]">
        <div className="w-10 h-10 bg-white rounded-full border border-gray-400" />
        <div className="flex flex-col justify-center">
          <p className="text-lg font-semibold">Mesa {code}</p>
          <p
            className={`text-xs font-medium ${
              is_active ? "text-green-600" : "text-red-600"
            }`}
          >
            State: {is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* Show QR button */}
      <div className="mt-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showQR ? "Ocultar QR" : "Mostrar QR"}
        </button>
      </div>

      {/* QR Code + Print */}
      {showQR && (
        <div className="mt-4 text-center">
          <Canvas
            text={qrUrl}
            options={{
              width: 160,
              margin: 1,
              color: { dark: "#000", light: "#fff" },
            }}
          />
          <button
            onClick={handlePrint}
            className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
