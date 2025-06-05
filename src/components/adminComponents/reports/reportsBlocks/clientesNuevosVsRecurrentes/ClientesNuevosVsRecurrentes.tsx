"use client";

import { useState } from "react";
import ClientesPorDia from "./ClientesPorDia";
import ClientesPorSemana from "./ClientesPorSemana";
import ClientesPorMes from "./ClientesPorMes";
import ClientesPorAño from "./ClientesPorAño";

const tabs = ["Week", "Month", "Year", "Day"]; // Day is disabled

const ClientesNuevosVsRecurrentes = () => {
    const [tab, setTab] = useState("Week");

    const renderTab = () => {
        switch (tab) {
            case "Day":
              return <ClientesPorDia />;
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
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-7xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">New vs Recurring Customers</h2>

            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value)}
                    className="border px-4 py-2 rounded-full text-sm max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
                >
                    {tabs.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div>{renderTab()}</div>
        </div>
    );
};

export default ClientesNuevosVsRecurrentes;
