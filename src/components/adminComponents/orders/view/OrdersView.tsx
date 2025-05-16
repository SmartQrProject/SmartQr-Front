import React from "react";
import TableList from "../tables/TableList";
import { ITables } from "@/types";

const OrdersView: React.FC<ITables> = () => {
    return (
        <div>
            <TableList />
        </div>
    );
};

export default OrdersView;
