"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import PromoCodesContainer from "@/components/adminComponents/promoCodes/PromoCodesContainer";
import Footer from "@/components/subscribers/footer/Footer";

const PromoCodesPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            router.push("/");
            return;
        }
        const role = user?.payload?.roles;
        if (role === "owner") {
            setAuthorized(true);
        } else {
            router.push("/404");
        }
        setCheckingAuth(false);
    }, [user, router]);

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
