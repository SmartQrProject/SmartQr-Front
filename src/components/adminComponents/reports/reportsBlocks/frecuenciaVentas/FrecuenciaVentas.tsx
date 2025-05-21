"use client";

import { useState } from "react";

import FrecuenciaPorHora from "./FrecuenciaPorHora";
import FrecuenciaPorSemana from "./FrecuenciaPorSemana";
import FrecuenciaPorMes from "./FrecuenciaPorMes";
import FrecuenciaPorAño from "./FrecuenciaPorAño";

const Tabs = [
  "Por hora del día",
  "Por día de la semana",
  "Por día del mes",
  "Por mes del año",
];

const FrecuenciaVentas = () => {
  const [tab, setTab] = useState("Por hora del día");

  const renderTab = () => {
    switch (tab) {
      case "Por hora del día":
        return <FrecuenciaPorHora />;
      case "Por día de la semana":
        return <FrecuenciaPorSemana />;
      case "Por día del mes":
        return <FrecuenciaPorMes />;
      case "Por mes del año":
        return <FrecuenciaPorAño />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Frecuencia de Ventas</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
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

      <div>{renderTab()}</div>
    </div>
  );
};

export default FrecuenciaVentas;
