"use client";

import React, { useState } from "react";
import TopPorDia from "./TopPorDia";
import TopPorSemana from "./TopPorSemana";
import TopPorMes from "./TopPorMes";
import TopPorAño from "./TopPorAño";
import TopCustom from "./TopCustom";

const Tabs = ["Day", "Week", "Month", "Year", "Custom"];

const IndexTopProductos = () => {
    const [tab, setTab] = useState("Day");

    const renderTab = () => {
        switch (tab) {
            case "Day":
                return <TopPorDia />;
            case "Week":
                return <TopPorSemana />;
            case "Month":
                return <TopPorMes />;
            case "Year":
                return <TopPorAño />;
            case "Custom":
                return <TopCustom />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">Top Products</h2>

            <div className="flex justify-center sm:justify-start mb-6">
                <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-full text-sm font-medium  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
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

export default IndexTopProductos;
