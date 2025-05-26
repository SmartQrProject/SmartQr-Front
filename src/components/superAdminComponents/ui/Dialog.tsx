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

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const DialogContent: React.FC<BaseProps> = ({ children, className = "", ...props }) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

export const DialogHeader: React.FC<BaseProps> = ({ children, className = "", ...props }) => {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const DialogTitle: React.FC<BaseProps> = ({ children, className = "", ...props }) => {
    return (
        <h2 className={`text-lg font-semibold ${className}`} {...props}>
            {children}
        </h2>
    );
};

export const DialogFooter: React.FC<BaseProps> = ({ children, className = "", ...props }) => {
    return (
        <div className={`mt-4 flex justify-end gap-2 ${className}`} {...props}>
            {children}
        </div>
    );
};
