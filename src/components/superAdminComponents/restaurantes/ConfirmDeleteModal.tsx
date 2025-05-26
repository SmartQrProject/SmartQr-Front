"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./../ui/Dialog"; // ✅ Asegúrate de usar el path correcto

interface ConfirmDeleteModalProps {
    slug: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ slug, onCancel, onConfirm }) => {
    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Restaurant</DialogTitle>
                </DialogHeader>

                <div className="py-4 text-sm">
                    <p>Are you sure you want to delete this restaurant?</p>
                    <p className="text-muted-foreground mt-2">This action cannot be undone.</p>
                    <div className="mt-2 text-xs text-gray-500">
                        <strong>Slug:</strong> {slug}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-500 text-white hover:bg-gray-600 transition">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition">
                        Delete
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
