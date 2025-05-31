"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import RestaurantPageClient from "@/components/adminComponents/editableRestaurant/landingPage/RestaurantPageClient";
import EditableCategories from "@/components/adminComponents/editableRestaurant/landingPage/EditableCategories";
import CategoryProductList from "./CategoryProductList";
import StoreInfoModal from "./StoreInfoAdmin";

export default function StorePageAdmin() {
    const { user } = useAuth();
    const router = useRouter();

    const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const handleOpenModal = () => setIsStoreInfoModalOpen(true);
    const handleCloseModal = () => setIsStoreInfoModalOpen(false);
    useEffect(() => {
        if (!user || !user.token) {
            router.push("/");
            return;
        }
        const role = user.payload?.roles;
        const slug = user.payload?.slug;

        if (role !== "owner" || !slug) {
            router.push("/admin/dashboard");
            return;
        }

        setIsAuthorized(true);
        setCheckingAuth(false);
    }, [user, router]);

    if (checkingAuth || !user) {
        return <p className="p-4 text-center">Loading restaurant...</p>;
    }

    if (!isAuthorized) {
        return null;
    }

    const slug = user.payload?.slug;

    return (
        <>
            <div>
                <button
                    onClick={handleOpenModal}
                    className="m-1 w-full max-w-[8rem] h-10 text-sm text-white font-semibold bg-default-800 rounded hover:bg-default-700 cursor-pointer"
                >
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
