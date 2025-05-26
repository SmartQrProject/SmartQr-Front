"use client";

import { useState } from "react";
import ClientesPorDia from "./ClientesPorDia";
import ClientesPorSemana from "./ClientesPorSemana";
import ClientesPorMes from "./ClientesPorMes";
import ClientesPorAño from "./ClientesPorAño";

const tabs = ["Week", "Month", "Year"]; // Day is disabled

const ClientesNuevosVsRecurrentes = () => {
  const [tab, setTab] = useState("Week");

  const renderTab = () => {
    switch (tab) {
      // case "Day":
      //   return <ClientesPorDia />;
      case "Week":
        return <ClientesPorSemana />;
      case "Month":
        return <ClientesPorMes />;
      case "Year":
        return <ClientesPorAño />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-xl border shadow-sm bg-white max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        New vs Recurring Customers
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

      {/* Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default ClientesNuevosVsRecurrentes;
