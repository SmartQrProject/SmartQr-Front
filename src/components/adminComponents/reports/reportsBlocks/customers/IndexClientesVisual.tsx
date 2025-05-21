"use client";

import { useState } from "react";
import TopClientesPorOrden from "./TopClientesPorOrden";
import TopClientesPorGasto from "./TopClientesPorGasto";
import TopClientesPorTicket from "./TopClientesPorTicket";
import ClientesNuevosPorMes from "./ClientesNuevosPorMes";

const tabs = [
  "Más órdenes",
  "Más gasto",
  "Mejor ticket promedio",
  "Nuevos por mes",
];

const IndexClientesVisual = () => {
  const [tab, setTab] = useState("Más órdenes");

  const renderTab = () => {
    switch (tab) {
      case "Más órdenes":
        return <TopClientesPorOrden />;
      case "Más gasto":
        return <TopClientesPorGasto />;
      case "Mejor ticket promedio":
        return <TopClientesPorTicket />;
      case "Nuevos por mes":
        return <ClientesNuevosPorMes />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Visualización de Clientes
      </h2>

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

      <div>{renderTab()}</div>
    </div>
  );
};

export default IndexClientesVisual;
