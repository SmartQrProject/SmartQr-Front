import React from "react";
import SubscriptionReport from "./subscriptionReport/SubscriptionReport";
import OwnerReport from "./ownerReport/OwnerReport";
import RestaurantStats from "./restaurantStats/RestaurantStats";
import OwnerContacts from "./ownerContacts/OwnerContacts";

const Reports = () => {
    return (
        <div>
            <SubscriptionReport />
            <OwnerReport />
            <RestaurantStats />
            <OwnerContacts />
        </div>
    );
};

export default Reports;
