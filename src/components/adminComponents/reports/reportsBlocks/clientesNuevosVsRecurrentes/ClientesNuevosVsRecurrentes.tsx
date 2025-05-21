"use client";

import { useState } from "react";
import ClientesPorDia from "./ClientesPorDia";
import ClientesPorSemana from "./ClientesPorSemana";
import ClientesPorMes from "./ClientesPorMes";
import ClientesPorAño from "./ClientesPorAño";

const tabs = ["Día", "Semana", "Mes", "Año"];

const ClientesNuevosVsRecurrentes = () => {
  const [tab, setTab] = useState("Día");

  const renderTab = () => {
    switch (tab) {
      case "Día":
        return <ClientesPorDia />;
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
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">
        Clientes Nuevos vs Recurrentes
      </h2>

      <div className="flex gap-2 mb-6">
        {tabs.map((item) => (
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

export default ClientesNuevosVsRecurrentes;
