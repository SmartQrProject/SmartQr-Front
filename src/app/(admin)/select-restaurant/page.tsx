"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/subscribers/navbar/Navbar";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  [key: string]: any;
}

export default function SelectRestaurantPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("adminSession");
    if (!stored) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.payload?.restaurant) {
        router.replace("/dashboard");
        return;
      }
      const list = parsed.payload?.restaurants;
      if (Array.isArray(list)) {
        if (list.length === 1) {
          const r = list[0];
          parsed.payload.restaurant = r;
          parsed.payload.slug = r.slug;
          localStorage.setItem("adminSession", JSON.stringify(parsed));
          setUser(parsed);
          router.replace("/dashboard");
          return;
        }
        setRestaurants(list);
      } else {
        router.replace("/dashboard");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

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
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6ebf2]">
      <Navbar />
      <div className="flex flex-col flex-1 items-center justify-center p-4 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#4f89f5]">
          Select your restaurant
        </h2>
        <div className="w-full max-w-md space-y-4">
          {restaurants.map((r) => (
            <ButtonPrimary key={r.id} onClick={() => handleSelect(r)}>
              {r.name}
            </ButtonPrimary>
          ))}
        </div>
      </div>
    </div>
  );
}

