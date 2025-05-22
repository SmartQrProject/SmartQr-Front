"use client";

import { useEffect, useState } from "react";
import { getRestaurant } from "@/helper/restaurantFetch";
import { IRestaurant } from "@/types";
import EditableBannerHero from "./EditableBanner";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { Store } from "lucide-react";
import { getRestaurantWithMenu } from "@/helper/restaurantsSlugFetch";

export default function RestaurantPageClient() {
  const { user } = useAuth(); 
  const slug = user?.payload?.slug;

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Missing restaurant slug");
      return;
    }

    getRestaurantWithMenu(slug)
      .then((res) => {
        console.log("Fetched restaurant data:", res);
        setRestaurant(res);
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!restaurant) return <div className="p-4">No restaurant found...</div>;

  return (
    <div className="mx-auto">
      <EditableBannerHero title={restaurant.name} initialBanner={restaurant.banner ?? undefined} />
    </div>
  );
}
