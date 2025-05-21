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
        <ReportBlock title="Ventas">
          <IndexVentas />
        </ReportBlock>

        <ReportBlock title="Top productos vendidos">
          <TopProductos />
        </ReportBlock>

        <ReportBlock title="Ctegorias más vendidas">
          <Categorias />
        </ReportBlock>

        <ReportBlock title="Frecuencia de ventas">
          <FrecuenciaVentas />
        </ReportBlock>

        <ReportBlock title="Clientes más frecuentes">
          <Customers />
        </ReportBlock>

        <ReportBlock title="Clientes nuevos vs recurrentes">
          <ClientesNuevosVsRecurrentes />
        </ReportBlock>
      </div>
    </>
  );
};

export default Reports;
