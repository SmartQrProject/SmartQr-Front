import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Reportssa from "@/components/superAdminComponents/reports/Reportssa";
import React from "react";

const Restaurants = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <NavbarAdmin />

            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <Reportssa />
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default Restaurants;
