"use client";

import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import RestaurantPageClient from '@/components/adminComponents/editableRestaurant/landingPage/RestaurantPageClient';
import EditableCategories from '@/components/adminComponents/editableRestaurant/landingPage/EditableCategories';
import { useState } from 'react';
import CategoryProductList from './CategoryProductList';
import StoreInfoModal from './StoreInfoAdmin';

export default function StorePageAdmin() {
  const { user } = useAuth();
  const slug = user?.payload?.slug;
  const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);

  const handleOpenModal = () => setIsStoreInfoModalOpen(true);
  const handleCloseModal = () => setIsStoreInfoModalOpen(false);

  if (!slug) {
    return <p className="p-4 text-center">Loading restaurant...</p>;
  }

  return (
    <>
      
      <div>
        <button onClick={handleOpenModal}  className="m-1 w-full max-w-[8rem] h-10 text-sm text-white font-semibold bg-default-800 rounded hover:bg-default-700 cursor-pointer">
        Store Info
        </button>
        <StoreInfoModal open={isStoreInfoModalOpen} onClose={handleCloseModal} slug={slug} />
      </div>

        <RestaurantPageClient />
        <EditableCategories slug={slug} />
        <CategoryProductList slug={slug} />
      
    </>
  );
}