"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantPageClient from "@/components/adminComponents/editableRestaurant/landingPage/RestaurantPageClient";
import EditableCategories from "@/components/adminComponents/editableRestaurant/landingPage/EditableCategories";
import CategoryProductList from "./CategoryProductList";
import StoreInfoModal from "./StoreInfoAdmin";
import Cookies from "js-cookie";



function parseJwt(token: string) {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

export default function StorePageAdmin() {
    const router = useRouter();

    const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [slug, setSlug] = useState("");
    const [token, setToken] = useState("");

    const handleOpenModal = () => setIsStoreInfoModalOpen(true);
    const handleCloseModal = () => setIsStoreInfoModalOpen(false);

    useEffect(() => {
        const token = Cookies.get("adminSession");
        if (!token) {
            router.push("/");
            return;
        }

        const payload = parseJwt(token);
        const role = payload?.roles;
        const userSlug = payload?.slug;

        if (role !== "owner" || !userSlug) {
            router.push("/admin/dashboard");
            return;
        }

        setSlug(userSlug);
        setToken(token);
        setIsAuthorized(true);
        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) {
        return <p className="p-4 text-center"> Loading restaurant...</p>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <>
            <div className="w-full flex justify-end px-4 py-2">
                <button
                    onClick={handleOpenModal}
                    className="m-1 w-full max-w-[8rem] h-10 text-sm text-white font-semibold bg-default-800 rounded hover:bg-default-700 cursor-pointer"
                >
                    Store Info
                </button>
                <StoreInfoModal open={isStoreInfoModalOpen} onClose={handleCloseModal} slug={slug} />
            </div>

            <RestaurantPageClient slug={slug} token={token} />
            <EditableCategories slug={slug} />
            <CategoryProductList slug={slug} />
        </>
    );
}
