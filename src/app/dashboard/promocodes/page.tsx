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

           
            localStorage.setItem("adminSession", JSON.stringify({ token, payload }));
        } else {
            router.push("/404");
        }

        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) {
        return <p className="p-4 text-center">Checking access...</p>;
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
