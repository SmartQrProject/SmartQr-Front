import { ITables } from "@/types";
import React from "react";

const Table: React.FC<ITables> = ({ code, is_active, created_at }) => {
    const date = created_at ? new Date(created_at) : null;
    const formattedDate = date ? date.toLocaleTimeString() : "N/A";

    return (
        <div className="flex items-center justify-between bg-gray-200 rounded-xl p-4 w-[260px] h-[120px] shadow-md">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full border border-gray-400"></div>

                <div>
                    <p className="text-lg font-semibold">Table {code}</p>
                    <p className="text-xs text-gray-600">Time order: {formattedDate}</p>
                    <p className="text-xs text-gray-600">
                        Order: {is_active ? <span className="text-green-600">Available</span> : <span className="text-red-500">Not available</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Table;
