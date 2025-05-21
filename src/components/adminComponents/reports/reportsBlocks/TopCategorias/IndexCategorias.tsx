"use client";

import { useState } from "react";
import CategoriaPorDia from "./CategoriaPorDia";
import CategoriaPorSemana from "./CategoriaPorSemana";
import CategoriaPorMes from "./CategoriaPorMes";
import CategoriaPorAño from "./CategoriaPorAño";
import CategoriaCustom from "./CategoriaCustom";

const Tabs = ["Día", "Semana", "Mes", "Año", "Custom"];

const Categorias = () => {
  const [tab, setTab] = useState("Día");

  const renderTab = () => {
    switch (tab) {
      case "Día":
        return <CategoriaPorDia />;
      case "Semana":
        return <CategoriaPorSemana />;
      case "Mes":
        return <CategoriaPorMes />;
      case "Año":
        return <CategoriaPorAño />;
      case "Custom":
        return <CategoriaCustom />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Ventas por Categoría</h2>

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

      <div>{renderTab()}</div>
    </div>
  );
};

export default Categorias;
