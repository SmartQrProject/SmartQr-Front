"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import { IRestaurant } from "@/types";

interface EditRestaurantModalProps {
    restaurant: IRestaurant;
    onClose: () => void;
    onUpdated: () => void;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function EditRestaurantModal({ restaurant, onClose, onUpdated }: EditRestaurantModalProps) {
    const [name, setName] = useState(restaurant.name);
    const [slug, setSlug] = useState(restaurant.slug);
    const [ownerEmail, setOwnerEmail] = useState(restaurant.owner_email);
    const [isOpen, setIsOpen] = useState(true);

    const handleUpdate = async () => {
        try {
            const sessionRaw = localStorage.getItem("adminSession");
            if (!sessionRaw) throw new Error("No session found");

            const session = JSON.parse(sessionRaw);
            const token = session.token;

            const endpoint = `${APIURL}/restaurants/${restaurant.slug}`;
            const payload = {
                name,
                slug,
                owner_email: ownerEmail,
            };

            const res = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update restaurant");

            toast.success("Restaurant updated successfully");
            onClose();
            onUpdated();
        } catch (err) {
            toast.error("Error updating restaurant");
            console.error("handleUpdate error:", err);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6 space-y-4 shadow-xl">
                    <DialogTitle className="text-lg font-bold">Edit Restaurant</DialogTitle>

                    <div className="space-y-2">
                        <div>
                            <label className="block text-sm font-medium">Restaurant Name</label>
                            <input type="text" className="w-full border p-2 rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Slug</label>
                            <input type="text" className="w-full border p-2 rounded-md" value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Owner Email</label>
                            <input type="email" className="w-full border p-2 rounded-md" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={handleClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Save Changes
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
