"use client";

import { useState } from "react";
import CategoriaPorDia from "./CategoriaPorDia";
import CategoriaPorSemana from "./CategoriaPorSemana";
import CategoriaPorMes from "./CategoriaPorMes";
import CategoriaPorAño from "./CategoriaPorAño";
import CategoriaCustom from "./CategoriaCustom";

const Tabs = ["Day", "Week", "Month", "Year", "Custom"];

const IndexCategorias = () => {
  const [tab, setTab] = useState("Day");

  const renderTab = () => {
    switch (tab) {
      case "Day":
        return <CategoriaPorDia />;
      case "Week":
        return <CategoriaPorSemana />;
      case "Month":
        return <CategoriaPorMes />;
      case "Year":
        return <CategoriaPorAño />;
      case "Custom":
        return <CategoriaCustom />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sales by Category
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

      {/* Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default IndexCategorias;
