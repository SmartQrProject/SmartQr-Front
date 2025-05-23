import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Reports from "@/components/adminComponents/reports/Reports";
import React from "react";

const reports = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <NavbarAdmin />

            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <Reports/>
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default reports;