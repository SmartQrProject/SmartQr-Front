"use client";

import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import RestaurantPageClient from "@/components/adminComponents/editableRestaurant/landingPage/RestaurantPageClient";
import EditableCategories from "@/components/adminComponents/editableRestaurant/landingPage/EditableCategories";
import { useState } from "react";
import ListProducts from "../../menu/views/ProductsView";
import CategoryProductList from "./CategoryProductList";

export default function StorePageAdmin() {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // starts closed

  console.log("user from context:", user);
  console.log("slug from payload:", slug);

  if (!slug) {
    return <p className="p-4 text-center">Loading restaurant...</p>;
  }

  return (
    <>
      <div>
        <RestaurantPageClient />
        <EditableCategories slug={slug} />
        <CategoryProductList slug={slug} />
      </div>
    </>
  );
}
