import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Reports from "@/components/adminComponents/reports/Reports";
import React from "react";

const reports = () => {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <NavbarAdmin />

            <div className="flex flex-1 overflow-x-hidden">
                <MenuAdmin />
                <main className="flex-1 p-4 overflow-x-hidden">
                    <Reports/>
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default reports;