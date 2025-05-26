"use client";

import React, { useState } from "react";
import VentasPorDia from "./VentasPorDia";
import VentasPorSemana from "./VentasPorSemana";
import VentasPorMes from "./VentasPorMes";
import VentasPorAño from "./VentasPorAño";
import VentasCustom from "./VentasCustom";

const Tabs = ["Day", "Week", "Month", "Year", "Custom"];

const IndexVentas = () => {
  const [tab, setTab] = useState("Day");

  const renderTab = () => {
    switch (tab) {
      case "Day":
        return <VentasPorDia />;
      case "Week":
        return <VentasPorSemana />;
      case "Month":
        return <VentasPorMes />;
      case "Year":
        return <VentasPorAño />;
      case "Custom":
        return <VentasCustom />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sales Summary</h2>

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

      {/* Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default IndexVentas;
