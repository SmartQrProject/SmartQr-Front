import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import RestaurantList from "@/components/superAdminComponents/restaurantes/RestaurantList";
import React from "react";

const Restaurants = () => {
    return (
        <div className="min-h-screen flex flex-col ">
            <NavbarAdmin />

            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex-1 p-4">
                    <RestaurantList />
                </main>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default Restaurants;
