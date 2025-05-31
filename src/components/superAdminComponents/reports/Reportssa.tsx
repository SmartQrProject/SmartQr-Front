"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubscriptionReport from "./subscriptionReport/SubscriptionReport";
import OwnerReport from "./ownerReport/OwnerReport";
import RestaurantStats from "./restaurantStats/RestaurantStats";
import OwnerContacts from "./ownerContacts/OwnerContacts";

const Reports = () => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const sessionRaw = localStorage.getItem("adminSession");
        if (!sessionRaw) {
            router.push("/404");
            return;
        }

        const session = JSON.parse(sessionRaw);
        const role = session.payload?.role;

        if (role !== "superAdmin") {
            router.push("/404");
            return;
        }

        setAuthorized(true);
        setCheckingAuth(false);
    }, [router]);

    if (checkingAuth) {
        return <p className="p-4 text-center">Checking access...</p>;
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="w-full px-4 sm:px-6 py-6 space-y-10">
            <SubscriptionReport />
            <OwnerReport />
            <RestaurantStats />
            <OwnerContacts />
        </div>
    );
};

export default Reports;
