import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Settings from "@/components/adminComponents/settings/Settings";
import React from "react";

const settings = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <NavbarAdmin />

            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <Settings/>
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default settings;