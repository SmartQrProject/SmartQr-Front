"use client";

import React, { useRef } from "react";
import { ITables } from "@/types";
import EditTableButton from "../tables/buttonsTable/EditTableButton";
import DeleteTableButton from "../tables/buttonsTable/DeleteTableButton";
import ToggleActiveSwitch from "../tables/buttonsTable/ToggleActiveSwitch";
import { useQRCode } from "next-qrcode";
import { Download, Printer } from "lucide-react";

interface TableProps extends ITables {
  slug: string;
  onTableDeleted: () => void;
  onTableEdited: () => void;
}

const Table: React.FC<TableProps> = ({
  id,
  code,
  created_at,
  is_active,
  slug,
  onTableDeleted,
  onTableEdited,
}) => {
  const { Canvas } = useQRCode();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrUrl = `https://smart-qr.tech/menu/${slug}?table=${code}`;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `QR_Table_${code}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

    const handlePrint = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (canvas) {
           
            setTimeout(() => {
            const dataUrl = canvas.toDataURL("image/png");
            const windowContent = `
                <html>
                <head><title>Print QR - Table ${code}</title></head>
                <body style="text-align:center;padding:40px">
                    <h2>Table ${code}</h2>
                    <img src="${dataUrl}" style="width:200px;height:auto" />
                    <p>${qrUrl}</p>
                </body>
                </html>`;
            const printWindow = window.open("", "", "width=400,height=600");
            if (printWindow) {
                printWindow.document.write(windowContent);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }
            }, 900);
        }
    };

  return (
    <div
      className={`relative rounded-2xl p-4 w-full max-w-xs shadow-md mx-auto ${
        is_active ? "bg-gray-100" : "bg-gray-50"
      }`}
    >
      
      <div className="absolute top-2 left-2 z-10">
        <EditTableButton
          tableId={id}
          currentCode={code}
          isActive={is_active}
          onTableEdited={onTableEdited}
        />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <DeleteTableButton tableId={id} onTableDeleted={onTableDeleted} />
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <ToggleActiveSwitch
          tableId={id}
          isActive={is_active}
          onToggle={onTableEdited}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 pt-6 pb-4">
        <p className="text-lg font-semibold text-gray-800">Table {code}</p>

        <div ref={qrRef}>
          <Canvas
            text={qrUrl}
            options={{
              errorCorrectionLevel: "M",
              margin: 2,
              scale: 4,
              width: 100,
              color: {
                dark: "#000000ff",
                light: "#ffffffff",
              },
            }}
          />
        </div>

        
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="p-2 rounded-full text-gray-700 hover:text-blue-600 transition cursor-pointer"
            title="Download QR"
            aria-label={`Download QR code for Table ${code}`}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-full text-gray-700 hover:text-green-600 transition cursor-pointer"
            title="Print QR"
            aria-label={`Print QR code for Table ${code}`}
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
