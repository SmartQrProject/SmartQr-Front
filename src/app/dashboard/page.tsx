'use client'
import React, { useEffect, useState } from "react";
import FooterAdmin from '@/components/adminComponents/footer/Footer';
import MenuAdmin from '@/components/adminComponents/menuLateral/MenuAdmin';
import NavbarAdmin from '@/components/adminComponents/navbar/NavbarAdmin';
import { useRouter } from "next/navigation";


const Home = () => {
    const router = useRouter();
  
  const [restaurantName, setRestaurantName] = useState("Restaurant");


  useEffect(() => {
  const session = localStorage.getItem("adminSession");
  if (!session) {
    router.replace("/login");
    return;
  }

  try {
    const parsed = JSON.parse(session);
    if (!parsed?.payload?.restaurant) {
      router.replace("/login");
      return;
    }

    setRestaurantName(parsed.payload.restaurant.name || "Restaurant");
  } catch {
    router.replace("/login");
  }
}, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <NavbarAdmin />

      <div className="flex flex-1">
        <MenuAdmin />

        <main className="flex flex-1 flex-col p-8 gap-6 justify-center items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to {restaurantName}!</h1>
          <p className="text-lg text-gray-700 max-w-xl text-center">
            We're glad to have you here. Manage your restaurant easily and efficiently from this dashboard.
          </p>
        </main>
      </div>

      <FooterAdmin />
    </div>
  );
};

export default Home;
