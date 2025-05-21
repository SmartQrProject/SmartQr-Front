"use client";

import React, { useState } from "react";
import TopPorDia from "./TopPorDia";
import TopPorSemana from "./TopPorSemana";
import TopPorMes from "./TopPorMes";
import TopPorAño from "./TopPorAño";
import TopCustom from "./TopCustom";

const tabs = ["Día", "Semana", "Mes", "Año", "Custom"];

const TopProductos = () => {
  const [tab, setTab] = useState("Día");

  const renderTab = () => {
    switch (tab) {
      case "Día":
        return <TopPorDia />;
      case "Semana":
        return <TopPorSemana />;
      case "Mes":
        return <TopPorMes />;
      case "Año":
        return <TopPorAño />;
      case "Custom":
        return <TopCustom />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Top productos vendidos</h2>
      <div className="flex gap-2 mb-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-full border ${
              tab === item ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
};

export default TopProductos;
