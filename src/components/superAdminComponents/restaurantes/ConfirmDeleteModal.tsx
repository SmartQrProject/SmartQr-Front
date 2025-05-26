"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./../ui/Dialog";

interface ConfirmDeleteModalProps {
    slug: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const Button = ({ variant, onClick, children }: { variant: "secondary" | "destructive"; onClick: () => void; children: React.ReactNode }) => {
    const base = "px-4 py-2 rounded-md text-white font-semibold transition-colors";
    const variants = {
        secondary: "bg-gray-500 hover:bg-gray-600",
        destructive: "bg-red-600 hover:bg-red-700",
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]}`}>
            {children}
        </button>
    );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ slug, onCancel, onConfirm }) => {
    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Restaurant</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p>Are you sure you want to delete this restaurant?</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Slug: <strong>{slug}</strong>
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
