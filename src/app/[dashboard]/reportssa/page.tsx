import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Reportssa from "@/components/superAdminComponents/reports/Reportssa";
import React from "react";

const Restaurants = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />

            <div className="flex flex-col md:flex-row flex-1">
                <aside className="w-full md:w-64 bg-white">
                    <MenuAdmin />
                </aside>

                <main className="flex-1 p-4 overflow-auto">
                    <Reportssa />
                </main>
            </div>

            <FooterAdmin />
        </div>
    );
};

export default Restaurants;
