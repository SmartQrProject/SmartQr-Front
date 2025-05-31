import React from "react";
import SubscriptionReport from "./subscriptionReport/SubscriptionReport";
import OwnerReport from "./ownerReport/OwnerReport";
import RestaurantStats from "./restaurantStats/RestaurantStats";
import OwnerContacts from "./ownerContacts/OwnerContacts";

const Reports = () => {
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
