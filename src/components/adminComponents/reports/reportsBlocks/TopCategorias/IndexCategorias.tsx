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
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">Sales by Category</h2>

            <div className="flex justify-center sm:justify-start mb-6">
                <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-full text-sm font-medium max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
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

export default IndexCategorias;
