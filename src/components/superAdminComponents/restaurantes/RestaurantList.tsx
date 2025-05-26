"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RestaurantCard from "./RestaurantCard";
import EditRestaurantModal from "./EditRestaurantModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { IRestaurant } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<IRestaurant | null>(null);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

    const fetchRestaurants = async () => {
        try {
            const sessionRaw = localStorage.getItem("adminSession");
            if (!sessionRaw) throw new Error("No session found");

            const session = JSON.parse(sessionRaw);
            const token = session.token;

            const res = await fetch(`${APIURL}/restaurants/all`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch restaurants");

            const data = await res.json();
            setRestaurants(Array.isArray(data) ? data : [data]);
        } catch (err) {
            toast.error("Error loading restaurants");
            console.error("fetchRestaurants error:", err);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
        try {
            const sessionRaw = localStorage.getItem("adminSession");
            if (!sessionRaw) throw new Error("No session found");

            const session = JSON.parse(sessionRaw);
            const token = session.token;

            const res = await fetch(`${APIURL}/restaurants/${slug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ is_active: !currentStatus }), // Solo modifica is_active
            });

            if (!res.ok) throw new Error("Failed to update restaurant status");

            toast.success("Restaurant status updated");
            fetchRestaurants();
        } catch (err) {
            toast.error("Error updating status");
            console.error("handleToggleStatus error:", err);
        }
    };

    const handleDeleteRestaurant = async (slug: string) => {
        try {
            const sessionRaw = localStorage.getItem("adminSession");
            if (!sessionRaw) throw new Error("No session found");

            const session = JSON.parse(sessionRaw);
            const token = session.token;

            const res = await fetch(`${APIURL}/restaurants/${slug}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete restaurant");

            toast.success("Restaurant deleted successfully");
            setDeletingSlug(null);
            fetchRestaurants();
        } catch (err) {
            toast.error("Error deleting restaurant");
            console.error("handleDeleteRestaurant error:", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>
            <div className="overflow-x-auto w-full rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                        <tr>
                            <th className="px-6 py-4">Restaurant Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Owner Email</th>
                            <th className="px-6 py-4">Date Created</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {restaurants.map((r) => (
                            <RestaurantCard
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                slug={r.slug}
                                owner_email={r.owner_email}
                                created_at={"created_at" in r ? String(r.created_at) : ""}
                                is_active={r.is_active}
                                onToggleStatus={() => handleToggleStatus(r.slug, r.is_active)}
                                onEdit={() => setEditingRestaurant(r)}
                                onDelete={() => setDeletingSlug(r.slug)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {editingRestaurant && (
                <EditRestaurantModal
                    restaurant={editingRestaurant}
                    onClose={() => setEditingRestaurant(null)}
                    onUpdated={() => {
                        setEditingRestaurant(null);
                        fetchRestaurants();
                    }}
                />
            )}

            {deletingSlug && <ConfirmDeleteModal slug={deletingSlug} onCancel={() => setDeletingSlug(null)} onConfirm={() => handleDeleteRestaurant(deletingSlug)} />}
        </div>
    );
}
