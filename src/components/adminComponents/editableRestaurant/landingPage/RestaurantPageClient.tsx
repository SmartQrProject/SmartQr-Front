"use client";

import { useEffect, useState } from "react";
import { getRestaurantWithMenu } from "@/helper/restaurantsSlugFetch";
import { IRestaurant } from "@/types";
import EditableBannerHero from "./EditableBanner";

interface Props {
  slug: string;
  token: string;
}

export default function RestaurantPageClient({ slug, token }: Props) {
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRestaurantWithMenu(slug)
            .then((res) => setRestaurant(res))
            .catch((err) => setError(err.message));
    }, [slug]);

    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!restaurant) return <div className="p-4">No restaurant found...</div>;

    return (
        <div className="mx-auto">
            <EditableBannerHero
                title={restaurant.name}
                initialBanner={restaurant.banner ?? undefined}
                slug={slug}
                token={token}
            />
        </div>
    );
}
