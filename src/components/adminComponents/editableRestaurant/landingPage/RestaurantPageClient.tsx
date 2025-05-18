"use client";

import { useEffect, useState } from "react";
import { getRestaurant } from "@/helper/restaurantFetch";
import { IRestaurant } from "@/types";
import EditableBannerHero from "./EditableBanner";

export default function RestaurantPageClient() {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      setError("Missing session");
      return;
    }

    const parsed = JSON.parse(session);
    const slug = parsed?.payload?.Restaurant?.slug;

    if (!slug) {
      setError("Missing restaurant slug in session");
      return;
    }

    getRestaurant(slug)
      .then((res) => setRestaurant(res))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!restaurant) return <div className="p-4">Loading...</div>;

  return (
    <>
      
      <div className="mx-auto">
        <EditableBannerHero title={restaurant.name} />
      </div>
      
    </>
  );
}
