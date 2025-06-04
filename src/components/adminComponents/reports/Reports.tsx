"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IndexVentas from "./reportsBlocks/ventas/IndexVentas";
import TopProductos from "./reportsBlocks/topProductos/IndexTopProductos";
import Categorias from "./reportsBlocks/TopCategorias/IndexCategorias";
import FrecuenciaVentas from "./reportsBlocks/frecuenciaVentas/FrecuenciaVentas";
import Customers from "./reportsBlocks/customers/Customers";
import ClientesNuevosVsRecurrentes from "./reportsBlocks/clientesNuevosVsRecurrentes/ClientesNuevosVsRecurrentes";
import ReportBlock from "./ReportBlock";

const tabs = [
    { key: "sales", title: "Sales", component: <IndexVentas /> },
    { key: "top-products", title: "Top Selling Products", component: <TopProductos /> },
    { key: "top-categories", title: "Top Categories", component: <Categorias /> },
    { key: "frequency", title: "Sales Frequency", component: <FrecuenciaVentas /> },
    { key: "customers", title: "Most Frequent Customers", component: <Customers /> },
    { key: "new-vs-recurring", title: "New vs Recurring Customers", component: <ClientesNuevosVsRecurrentes /> },
];

const Reports = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState("sales");

    useEffect(() => {
        const session = localStorage.getItem("adminSession");
        if (!session) {
            router.push("/");
            return;
        }

        const parsed = JSON.parse(session);
        const role = parsed.payload?.roles;
        const token = parsed.token;

        if (token && role === "owner") {
            setAuthorized(true);
        } else {
            router.push("/404");
        }

        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) return <p className="p-4 text-center">Checking access...</p>;
    if (!authorized) return null;

    const currentTab = tabs.find((tab) => tab.key === activeTab);

    return (
        <div className="p-4 max-w-8xl mx-auto">
            <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 w-max min-w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-full ${activeTab === tab.key ? "text-branding-600" : "text-black cursor-pointer"}`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {currentTab && <ReportBlock title={currentTab.title}>{currentTab.component}</ReportBlock>}
        </div>
    );
};

export default Reports;
