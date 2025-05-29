"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";

interface OwnerContact {
    ownerName?: string | null;
    ownerEmail?: string | null;
    phone?: string | null;
    address?: string | null;
    restaurantName?: string | null;
}

export default function OwnerContacts() {
    const { user } = useAuth();
    const slug = user?.payload?.slug;
    const token = user?.token;

    const [contacts, setContacts] = useState<OwnerContact[]>([]);

    useEffect(() => {
        if (!slug || !token) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/reports/admin/owners`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch owner contacts");

                const data = await res.json();

                setContacts(data);
            } catch (err) {
                toast.error("Failed to load owner contacts");
            }
        };

        fetchData();
    }, [slug, token]);

    const getSafe = (value?: string | null) => (value && value.trim() !== "" ? value : "N/A");

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Restaurant Owner Contacts</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-2 text-left text-gray-500 uppercase">Phone</th>
                            <th className="px-4 py-2 text-left text-gray-500 uppercase">Address</th>
                            <th className="px-4 py-2 text-left text-gray-500 uppercase">Restaurant</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            contacts.map((owner, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{getSafe(owner.ownerName)}</td>
                                    <td className="px-4 py-2">{getSafe(owner.ownerEmail)}</td>
                                    <td className="px-4 py-2">{getSafe(owner.phone)}</td>
                                    <td className="px-4 py-2">{getSafe(owner.address)}</td>
                                    <td className="px-4 py-2">{getSafe(owner.restaurantName)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
