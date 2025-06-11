"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import PromoCodesContainer from "@/components/adminComponents/promoCodes/PromoCodesContainer";
import Footer from "@/components/subscribers/footer/Footer";
import Cookies from "js-cookie";

function parseJwt(token: string) {
    try {
        const base64Payload = token.split(".")[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (e) {
        console.error("Invalid token");
        return null;
    }
}

const PromoCodesPage = () => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = Cookies.get("adminSession");

        if (!token) {
            router.push("/");
            return;
        }

        const payload = parseJwt(token);

        if (payload?.roles === "owner") {
            setAuthorized(true);

            // Preserve existing restaurant/slug data stored in localStorage
            try {
                const existing = localStorage.getItem("adminSession");
                if (existing) {
                    const parsed = JSON.parse(existing);
                    const mergedPayload = { ...payload, ...parsed.payload };
                    localStorage.setItem(
                        "adminSession",
                        JSON.stringify({ token, payload: mergedPayload })
                    );
                } else {
                    localStorage.setItem("adminSession", JSON.stringify({ token, payload }));
                }
            } catch {
                localStorage.setItem("adminSession", JSON.stringify({ token, payload }));
            }
        } else {
            router.push("/404");
        }

        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) {
        return (
            <div className="flex gap-4 justify-center items-center h-40">
                <p className=" text-sm md:text-2xl text-branding-900">Checking Access...</p>
                <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarAdmin />
            <div className="flex flex-1">
                <MenuAdmin />
                <main className="flex flex-1 items-center justify-center p-6 bg-gray-50">
                    <PromoCodesContainer />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default PromoCodesPage;
