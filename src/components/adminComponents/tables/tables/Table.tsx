"use client";

import React, { useEffect, useRef, useState } from "react";
import { ITables } from "@/types";
import EditTableButton from "./../tables/buttonsTable/EditTableButton";
import DeleteTableButton from "./../tables/buttonsTable/DeleteTableButton";
import ToggleActiveSwitch from "./../tables/buttonsTable/ToggleActiveSwitch";
import { useQRCode } from "next-qrcode";
import { Download, Printer } from "lucide-react";
import toast from "react-hot-toast";

interface TableProps extends ITables {
    slug: string;
    onTableDeleted: () => void;
    onTableEdited: () => void;
}

const Table: React.FC<TableProps> = ({ id, code, created_at, is_active, slug, onTableDeleted, onTableEdited }) => {
    const { Canvas } = useQRCode();
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const qrUrl = `https://smart-qr.tech/menu/${slug}?table=${code}`;

    useEffect(() => {
        const timeout = setTimeout(() => {
            const canvas = qrRef.current?.querySelector("canvas");
            if (canvas) {
                const dataUrl = canvas.toDataURL("image/png");
                setQrImage(dataUrl);
            }
        }, 100); // leve delay para esperar render

        return () => clearTimeout(timeout);
    }, []);

    const handleDownload = () => {
        if (!qrImage) {
            toast.error("QR no está listo aún");
            return;
        }
        const link = document.createElement("a");
        link.download = `QR_Table_${code}.png`;
        link.href = qrImage;
        link.click();
    };

    const handlePrint = () => {
        if (!qrImage) {
            toast.error("QR no está listo para imprimir");
            return;
        }

        const windowContent = `
    <html>
      <head><title>Print QR - Table ${code}</title></head>
      <body style="text-align:center;padding:40px">
        <h2>Table ${code}</h2>
        <img id="qr-image" src="${qrImage}" style="width:200px;height:auto" />
        <p>${qrUrl}</p>
      </body>
    </html>`;

        const printWindow = window.open("", "", "width=400,height=600");
        if (printWindow) {
            printWindow.document.write(windowContent);
            printWindow.document.close();

            // Asegurarse de que la imagen cargue antes de imprimir
            printWindow.onload = () => {
                const img = printWindow.document.getElementById("qr-image") as HTMLImageElement;
                if (img && !img.complete) {
                    img.onload = () => {
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    };
                } else {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                }
            };
        }
    };

    return (
        <div className={`relative rounded-xl p-4 w-[260px] shadow-md ${is_active ? "bg-gray-200" : "bg-gray-100"}`}>
            <div className="absolute top-2 left-2">
                <EditTableButton tableId={id} currentCode={code} isActive={is_active} onTableEdited={onTableEdited} />
            </div>
            <div className="absolute top-2 right-2">
                <DeleteTableButton tableId={id} onTableDeleted={onTableDeleted} />
            </div>
            <div className="absolute bottom-2 right-2">
                <ToggleActiveSwitch tableId={id} isActive={is_active} onToggle={onTableEdited} />
            </div>

            <div className="flex flex-col items-center justify-center h-full gap-2 pt-4">
                <p className="text-lg font-semibold">Table {code}</p>
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

                <div className="flex gap-2 mt-2">
                    <button onClick={handleDownload} className="text-md text-default-900 font-semibold  hover:text-blue-600 cursor-pointer ">
                        <Download />
                    </button>
                    <button onClick={handlePrint} className="text-md text-default-900 font-semibold  hover:text-green-600 cursor-pointer">
                        <Printer />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;
