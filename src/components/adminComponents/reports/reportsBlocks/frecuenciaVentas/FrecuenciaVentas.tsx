"use client";

import { useState } from "react";
import FrecuenciaPorHora from "./FrecuenciaPorHora";
import FrecuenciaPorSemana from "./FrecuenciaPorSemana";
import FrecuenciaPorMes from "./FrecuenciaPorMes";
import FrecuenciaPorAño from "./FrecuenciaPorAño";

const Tabs = ["Hour", "Week", "Month", "Year"];

const IndexFrecuencia = () => {
    const [tab, setTab] = useState("Hour");

    const renderTab = () => {
        switch (tab) {
            case "Hour":
                return <FrecuenciaPorHora />;
            case "Week":
                return <FrecuenciaPorSemana />;
            case "Month":
                return <FrecuenciaPorMes />;
            case "Year":
                return <FrecuenciaPorAño />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-8xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">Sales Frequency</h2>

            <div className="flex justify-center sm:justify-start mb-6">
                <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-full text-sm font-medium w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
                >
                    {Tabs.map((item) => (
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

export default IndexFrecuencia;
