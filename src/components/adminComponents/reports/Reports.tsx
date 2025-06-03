"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IndexVentas from "./reportsBlocks/ventas/IndexVentas";
import TopProductos from "./reportsBlocks/topProductos/IndexTopProductos";
import ReportBlock from "./ReportBlock";
import Categorias from "./reportsBlocks/TopCategorias/IndexCategorias";
import FrecuenciaVentas from "./reportsBlocks/frecuenciaVentas/FrecuenciaVentas";
import Customers from "./reportsBlocks/customers/Customers";
import ClientesNuevosVsRecurrentes from "./reportsBlocks/clientesNuevosVsRecurrentes/ClientesNuevosVsRecurrentes";

const Reports = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

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
        return(
            <div className="flex gap-4 justify-center items-center h-40">
                <p className=" text-sm md:text-2xl text-branding-900">Checking Access...</p>
                <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
         
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="p-4 grid gap-6">
            <ReportBlock title="Sales">
                <IndexVentas />
            </ReportBlock>
            <ReportBlock title="Top Selling Products">
                <TopProductos />
            </ReportBlock>
            <ReportBlock title="Top Categories">
                <Categorias />
            </ReportBlock>
            <ReportBlock title="Sales Frequency">
                <FrecuenciaVentas />
            </ReportBlock>
            <ReportBlock title="Most Frequent Customers">
                <Customers />
            </ReportBlock>
            <ReportBlock title="New vs Recurring Customers">
                <ClientesNuevosVsRecurrentes />
            </ReportBlock>
        </div>
    );
};

export default Reports;
