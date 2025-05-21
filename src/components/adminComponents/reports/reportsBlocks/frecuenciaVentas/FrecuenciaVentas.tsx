"use client";

import { useState } from "react";
import FrecuenciaPorHora from "./FrecuenciaPorHora";
import FrecuenciaPorSemana from "./FrecuenciaPorSemana";
import FrecuenciaPorMes from "./FrecuenciaPorMes";
import FrecuenciaPorAño from "./FrecuenciaPorAño";

const Tabs = ["Hora", "Semana", "Mes", "Año"];

const IndexFrecuencia = () => {
  const [tab, setTab] = useState("Hora");

  const renderTab = () => {
    switch (tab) {
      case "Hora":
        return <FrecuenciaPorHora />;
      case "Semana":
        return <FrecuenciaPorSemana />;
      case "Mes":
        return <FrecuenciaPorMes />;
      case "Año":
        return <FrecuenciaPorAño />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Frecuencia de Ventas
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-full border transition ${
              tab === item
                ? "bg-black text-white shadow"
                : "bg-gray-100 text-black hover:bg-gray-200"
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

export default IndexFrecuencia;
