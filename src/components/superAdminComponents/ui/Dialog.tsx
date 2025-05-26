"use client";

import React from "react";

interface DialogProps {
    open: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">{children}</div>
        </div>
    );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
    return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
    return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const DialogFooter = ({ children }: { children: React.ReactNode }) => {
    return <div className="mt-4 flex justify-end gap-2">{children}</div>;
};
