"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import React from "react";
import IndexVentas from "./reportsBlocks/ventas/IndexVentas";
import GananciaNeta from "./reportsBlocks/GananciaNeta";
import TopProductos from "./reportsBlocks/topProductos/IndexTopProductos";
import MetodosPago from "./reportsBlocks/MetodosPago";
import CuponesAplicados from "./reportsBlocks/CuponesAplicados";
import FrecuenciaClientes from "./reportsBlocks/FrecuenciaClientes";
import UltimasVisitas from "./reportsBlocks/UltimasVisitas";
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

        {/* <ReportBlock title="Métodos de pago">
          <MetodosPago />
        </ReportBlock>

        <ReportBlock title="Cupones aplicados">
          <CuponesAplicados />
        </ReportBlock>

        <ReportBlock title="Frecuencia de clientes">
          <FrecuenciaClientes />
        </ReportBlock>

        <ReportBlock title="Últimas visitas">
          <UltimasVisitas />
        </ReportBlock>

        <ReportBlock title="Ganancia neta">
          <GananciaNeta />
        </ReportBlock> */}
      </div>
    </>
  );
};

export default Reports;
