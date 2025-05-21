"use client";

import React, { useState } from "react";
import VentasPorDia from "./VentasPorDia";
import VentasPorSemana from "./VentasPorSemana";
import VentasPorMes from "./VentasPorMes";
import VentasPorAño from "./VentasPorAño";
import VentasCustom from "./VentasCustom";

const Tabs = ["Día", "Semana", "Mes", "Año", "Custom"];

const IndexVentas = () => {
  const [tab, setTab] = useState("Día");

  const renderTab = () => {
    switch (tab) {
      case "Día":
        return <VentasPorDia />;
      case "Semana":
        return <VentasPorSemana />;
      case "Mes":
        return <VentasPorMes />;
      case "Año":
        return <VentasPorAño />;
      case "Custom":
        return <VentasCustom />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Ventas</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {Tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-full border ${
              tab === item ? "bg-black text-white" : "bg-gray-100 text-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default IndexVentas;
