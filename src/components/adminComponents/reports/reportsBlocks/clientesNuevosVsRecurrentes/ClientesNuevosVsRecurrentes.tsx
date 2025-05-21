"use client";

import { useState } from "react";
import ClientesPorDia from "./ClientesPorDia";
import ClientesPorSemana from "./ClientesPorSemana";
import ClientesPorMes from "./ClientesPorMes";
import ClientesPorAño from "./ClientesPorAño";

const tabs = ["Semana", "Mes", "Año"]; // Día está desactivado

const ClientesNuevosVsRecurrentes = () => {
  const [tab, setTab] = useState("Semana");

  const renderTab = () => {
    switch (tab) {
      // case "Día":
      //   return <ClientesPorDia />;
      case "Semana":
        return <ClientesPorSemana />;
      case "Mes":
        return <ClientesPorMes />;
      case "Año":
        return <ClientesPorAño />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Clientes Nuevos vs Recurrentes
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((item) => (
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

export default ClientesNuevosVsRecurrentes;
