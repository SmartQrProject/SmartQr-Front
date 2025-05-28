"use client";

import React from "react";
import Table from "./Table";
import { ITables } from "@/types";

interface Props {
  slug: string; 
  tables: ITables[];
  onTableDeleted: () => void;
  onTableEdited: () => void;
}

const TableList: React.FC<Props> = ({ slug, tables, onTableDeleted, onTableEdited }) => {
  return (
    <div className="mx-auto px-4 py-8 m-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <Table
            key={table.id}
            {...table}
            slug={slug} 
            onTableDeleted={onTableDeleted}
            onTableEdited={onTableEdited}
          />
        ))}
      </div>
    </div>
  );
};

export default TableList;
