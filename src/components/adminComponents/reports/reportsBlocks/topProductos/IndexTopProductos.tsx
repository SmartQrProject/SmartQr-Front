"use client";

import React, { useState } from "react";
import TopPorDia from "./TopPorDia";
import TopPorSemana from "./TopPorSemana";
import TopPorMes from "./TopPorMes";
import TopPorAño from "./TopPorAño";
import TopCustom from "./TopCustom";

const Tabs = ["Día", "Semana", "Mes", "Año", "Custom"];

const IndexTopProductos = () => {
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
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Top productos</h2>

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

export default IndexTopProductos;
