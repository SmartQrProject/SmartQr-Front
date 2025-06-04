import React from "react";

interface ReportBlockProps {
    title: string;
    children: React.ReactNode;
}

const ReportBlock = ({ title, children }: ReportBlockProps) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-left sm:text-center">{title}</h2>
            {children}
        </div>
    );
};

export default ReportBlock;
