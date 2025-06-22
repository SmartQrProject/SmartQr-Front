
import { useEffect, useState } from "react";
import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menuLateral/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ListMyResturants from "@/components/adminComponents/myRestaurants/ListMyRestaurants";


const ListResturantPage = () => {


  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAdmin />
      <div className="flex flex-1">
        <MenuAdmin />
        <main className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-[#4f89f5] mb-4">My Restaurants</h2>
          <div>
            <ListMyResturants/>
          </div>
        </main>          
      </div>
      <FooterAdmin />
    </div>
  );
};

export default ListResturantPage;
