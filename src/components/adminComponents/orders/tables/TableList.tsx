import React from "react";
import Table from "./Table";
import { ITables } from "@/types";
import { tabletopreload } from "./helpers/tabletopreload";
import Link from "next/link";

const tables = tabletopreload;
const activeExistingTables = tables.filter((table) => table.is_active && table.exist);

const TableList: React.FC<ITables> = () => {
    return (
        <div className="mx-auto px-4 py-8 m-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeExistingTables &&
                    activeExistingTables.map((tables) => (
                        <Link key={tables.id} href={`/tables/${tables.id}`}>
                            <Table {...tables} />
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default TableList;
