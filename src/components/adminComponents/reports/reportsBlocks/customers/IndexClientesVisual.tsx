"use client";

import { useState } from "react";
import TopClientesPorOrden from "./TopClientesPorOrden";
import TopClientesPorGasto from "./TopClientesPorGasto";
import TopClientesPorTicket from "./TopClientesPorTicket";
import ClientesNuevosPorMes from "./ClientesNuevosPorMes";

const tabs = ["Most Orders", "Highest Spending", "Best Average Ticket", "New by Month"];

const IndexClientesVisual = () => {
    const [tab, setTab] = useState("Most Orders");

    const renderTab = () => {
        switch (tab) {
            case "Most Orders":
                return <TopClientesPorOrden />;
            case "Highest Spending":
                return <TopClientesPorGasto />;
            case "Best Average Ticket":
                return <TopClientesPorTicket />;
            case "New by Month":
                return <ClientesNuevosPorMes />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-7xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-center sm:text-left">Customer Visualization</h2>

            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <select
                    value={tab}
                    onChange={(e) => setTab(e.target.value)}
                    className="border px-4 py-2 rounded-full text-sm w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg focus:outline-none focus:ring-2 focus:ring-branding-500"
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

export default IndexClientesVisual;
