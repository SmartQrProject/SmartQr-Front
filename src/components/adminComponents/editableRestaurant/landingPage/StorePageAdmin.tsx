"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantPageClient from "@/components/adminComponents/editableRestaurant/landingPage/RestaurantPageClient";
import EditableCategories from "@/components/adminComponents/editableRestaurant/landingPage/EditableCategories";
import CategoryProductList from "./CategoryProductList";
import StoreInfoModal from "./StoreInfoAdmin";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { PencilIcon } from "lucide-react";

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
    const [products, setProducts] = useState<any[]>([]);

    const handleOpenModal = () => setIsStoreInfoModalOpen(true);
    const handleCloseModal = () => setIsStoreInfoModalOpen(false);

    const getProducts = async () => {
        if (!token || !slug) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);

            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error en getProducts:", err);
            if (!(err instanceof Error && err.message.includes("404"))) {
                toast.error("Error al cargar productos");
            }
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const sessionRaw = localStorage.getItem("adminSession");
            if (sessionRaw) {
                try {
                    const session = JSON.parse(sessionRaw);
                    const extractedToken = session.token;
                    const extractedSlug = session.restaurant?.slug || session.payload?.restaurant?.slug || session.payload?.slug;
                    const roles = session.payload?.roles;

                    if (!roles || !roles.includes("owner")) {
                        router.push("/404");
                        return;
                    }

                    if (extractedToken && extractedSlug) {
                        setSlug(extractedSlug);
                        setToken(extractedToken);
                        setIsAuthorized(true);
                    }
                } catch (error) {
        setToken(token);
                    toast.error("Invalid session data");
                }
            }
            setCheckingAuth(false);
        }
    }, [router]);

    useEffect(() => {
        if (slug && token) getProducts();
    }, [slug, token]);

    useEffect(() => {
        const handleProductCreated = () => getProducts();
        window.addEventListener("product:created", handleProductCreated);
        return () => window.removeEventListener("product:created", handleProductCreated);
    }, [token, slug]);

    if (checkingAuth) {
        return (
            <div className="flex gap-4 justify-center items-center h-40">
                <p className=" text-sm md:text-2xl text-branding-900">Loading...</p>
                <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }


    if (!isAuthorized) {
        return null;
    }

    return (
        <>
            <div className="w-full flex justify-end px-4 py-2">
                <button
                    onClick={handleOpenModal}
                    className=" top-4 right-4 z-30 bg-branding-200/80 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-branding-200 flex items-center gap-2 cursor-pointer "
                >
                    <PencilIcon className="w-4 h-4" />
                    Store Info
                </button>
                <StoreInfoModal open={isStoreInfoModalOpen} onClose={handleCloseModal} slug={slug} />
            </div>

            <RestaurantPageClient slug={slug} token={token} />
            <EditableCategories slug={slug} refetchProducts={getProducts} />
            <CategoryProductList slug={slug} products={products} refetchProducts={getProducts} />
        </>
    );
}
