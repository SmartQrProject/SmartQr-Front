"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import React from "react";
import IndexVentas from "./reportsBlocks/ventas/IndexVentas";
import TopProductos from "./reportsBlocks/topProductos/IndexTopProductos";

import ReportBlock from "./ReportBlock";
import Categorias from "./reportsBlocks/TopCategorias/IndexCategorias";
import FrecuenciaVentas from "./reportsBlocks/frecuenciaVentas/FrecuenciaVentas";
import Customers from "./reportsBlocks/customers/Customers";
import ClientesNuevosVsRecurrentes from "./reportsBlocks/clientesNuevosVsRecurrentes/ClientesNuevosVsRecurrentes";

const Reports = () => {
  const { user } = useAuth();
  const token = user?.token;

  return (
    <>
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
    </>
  );
};

export default Reports;
