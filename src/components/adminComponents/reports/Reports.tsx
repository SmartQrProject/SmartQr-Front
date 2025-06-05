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

  if (checkingAuth) {
    return (
      <div className="flex gap-4 justify-center items-center h-40">
        <p className="text-sm md:text-2xl text-branding-900">Checking Access...</p>
        <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  const currentTab = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="p-4">
      <div className="mb-6">
        
        <div className="w-full overflow-x-auto">
          <div className="flex flex-nowrap gap-3 px-2 py-2 w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                  activeTab === tab.key
                    ? "text-branding-600 font-semibold"
                    : "text-gray-700 hover:text-branding-600"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      {currentTab && (
        <ReportBlock title={currentTab.title}>{currentTab.component}</ReportBlock>
      )}
    </div>
  );
};

export default Reports;
