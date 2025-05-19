"use client";

import React from "react";
import { ITables } from "@/types";
import EditTableButton from "./../tables/buttonsTable/EditTableButton";
import DeleteTableButton from "./../tables/buttonsTable/DeleteTableButton";
import ToggleActiveSwitch from "./../tables/buttonsTable/ToggleActiveSwitch";
interface TableProps extends ITables {
    onTableDeleted: () => void;
    onTableEdited: () => void;
}

const Table: React.FC<TableProps> = ({ id, code, created_at, is_active, onTableDeleted, onTableEdited }) => {
    return (
        <div className={`relative rounded-xl p-4 w-[260px] h-[120px] shadow-md ${is_active ? "bg-gray-200" : "bg-gray-100 opacity-50"}`}>
            <div className="absolute top-2 left-2">
                <EditTableButton tableId={id} currentCode={code} isActive={is_active} onTableEdited={onTableEdited} />
            </div>
            <div className="absolute top-2 right-2">
                <DeleteTableButton tableId={id} onTableDeleted={onTableDeleted} />
            </div>
            <div className="absolute bottom-2 right-2">
                <ToggleActiveSwitch tableId={id} isActive={is_active} onToggle={onTableEdited} />
            </div>

            <div className="flex items-center gap-4 h-full">
                <div className="w-10 h-10 bg-white rounded-full border border-gray-400" />
                <div className="flex flex-col justify-center">
                    <p className="text-lg font-semibold">Mesa {code}</p>
                    <p className="text-xs text-green-600 font-medium">State: {is_active ? "Active" : "Inactive"}</p>
                </div>
            </div>
        </div>
    );
};
export default Table;
