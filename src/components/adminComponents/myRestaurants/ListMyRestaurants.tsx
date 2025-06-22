"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  [key: string]: any;
}

const ListMyResturants = () => {
      const router = useRouter();
      const { setUser } = useAuth();
          
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("adminSession");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const list = parsed.payload?.restaurants;

      if (Array.isArray(list)) {
        setRestaurants(list);
      }
    } catch (error) {
      console.error("Error parsing adminSession", error);
    }
  }, []);
  const handleSelect = (restaurant: Restaurant) => {
  const stored = localStorage.getItem("adminSession");
  if (!stored) {
    router.replace("/login");
    return;
  }
  try {
    const parsed = JSON.parse(stored);
    parsed.payload.restaurant = restaurant;
    parsed.payload.slug = restaurant.slug;
    localStorage.setItem("adminSession", JSON.stringify(parsed));
    setUser(parsed);
    router.replace("/dashboard");
  } catch {

   }
 };

  return (
    <div className="min-h-screen flex flex-col">
        <div className="p-4 flex justify-end">
            <Link href="/signup"className="py-2 px-4 font-semibold bg-green-600 hover:bg-green-700 text-white rounded flex gap-2 items-center"><PlusCircle className="h-4 w-4" />Add New Restaurant</Link>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-lg shadow-md bg-white border border-gray-200"
              >
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500">Slug: {r.slug}</p>
                <p
                  className={`text-sm mt-1 font-medium ${
                    r.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.is_active ? "Active" : "Inactive"}
                </p>
                <ButtonPrimary key={r.id} onClick={() => handleSelect(r)}>
              {r.name}
            </ButtonPrimary>
              </div>
            ))}
          </div>
          
    </div>
  );
};

export default ListMyResturants;
