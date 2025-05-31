"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RestaurantCard from "./RestaurantCard";
import EditRestaurantModal from "./EditRestaurantModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { IRestaurant } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface IRestaurantWithOwnerName extends IRestaurant {
    owner_name: string;
}

export default function RestaurantList() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<IRestaurantWithOwnerName[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<IRestaurant | null>(null);
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const sessionRaw = localStorage.getItem("adminSession");
        if (!sessionRaw) {
            router.push("/404");
            return;
        }

        const session = JSON.parse(sessionRaw);
        const role = session.payload?.role;

        if (role !== "superAdmin") {
            router.push("/404");
            return;
        }

        setAuthorized(true);
        setCheckingAuth(false);
    }, [router]);

    const getSession = () => {
        const sessionRaw = localStorage.getItem("adminSession");
        if (!sessionRaw) throw new Error("No session found");

        const session = JSON.parse(sessionRaw);
        const token = session.token;
        const slug = session.payload?.slug;

        if (!token || !slug) throw new Error("Missing token or slug");
        return { token, slug };
    };

    const fetchRestaurants = async (token: string) => {
        const res = await fetch(`${APIURL}/restaurants/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch restaurants");

        const data = await res.json();
        return Array.isArray(data) ? data : [data];
    };

    const fetchOwners = async (token: string, slug: string) => {
        const res = await fetch(`${APIURL}/${slug}/reports/admin/owners`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch owner data");

        const data = await res.json();

        const ownerMap: Record<string, string> = {};
        for (const owner of data) {
            ownerMap[owner.ownerEmail] = owner.ownerName;
        }

        return ownerMap;
    };

    const loadData = async () => {
        try {
            const { token, slug } = getSession();
            const [restaurantData, ownerMap] = await Promise.all([fetchRestaurants(token), fetchOwners(token, slug)]);

            const combined: IRestaurantWithOwnerName[] = restaurantData.map((r) => ({
                ...r,
                owner_name: ownerMap[r.owner_email] || "N/A",
            }));

            setRestaurants(combined);
        } catch (err) {
            toast.error("Error loading data");
        }
    };

    useEffect(() => {
        if (authorized) {
            loadData();
        }
    }, [authorized]);

    const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
        try {
            const { token } = getSession();

            const res = await fetch(`${APIURL}/restaurants/${slug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ is_active: !currentStatus }),
            });

            if (!res.ok) throw new Error("Failed to update restaurant status");

            toast.success("Restaurant status updated");
            loadData();
        } catch (err) {
            toast.error("Error updating status");
        }
    };

    const handleDeleteRestaurant = async (slug: string) => {
        try {
            const { token } = getSession();

            const res = await fetch(`${APIURL}/restaurants/${slug}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete restaurant");

            toast.success("Restaurant deleted successfully");
            setDeletingSlug(null);
            loadData();
        } catch (err) {
            toast.error("Error deleting restaurant");
        }
    };

    if (checkingAuth) {
        return <p className="p-4 text-center">Checking access...</p>;
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>
            <div className="overflow-x-auto w-full rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full text-xs sm:text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                        <tr>
                            <th className="px-4 py-3">Restaurant Name</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Owner Name</th>
                            <th className="px-4 py-3">Owner Email</th>
                            <th className="px-4 py-3">Date Created</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {restaurants.map((r) =>
                            r.id ? (
                                <RestaurantCard
                                    key={r.id}
                                    id={r.id}
                                    name={r.name}
                                    slug={r.slug}
                                    owner_email={r.owner_email}
                                    owner_name={r.owner_name}
                                    created_at={"created_at" in r ? String(r.created_at) : ""}
                                    is_active={r.is_active}
                                    onToggleStatus={() => handleToggleStatus(r.slug, r.is_active)}
                                    onEdit={() => setEditingRestaurant(r)}
                                    onDelete={() => setDeletingSlug(r.slug)}
                                />
                            ) : null,
                        )}
                    </tbody>
                </table>
            </div>

            {editingRestaurant && (
                <EditRestaurantModal
                    restaurant={editingRestaurant}
                    onClose={() => setEditingRestaurant(null)}
                    onUpdated={() => {
                        setEditingRestaurant(null);
                        loadData();
                    }}
                />
            )}

            {deletingSlug && <ConfirmDeleteModal slug={deletingSlug} onCancel={() => setDeletingSlug(null)} onConfirm={() => handleDeleteRestaurant(deletingSlug)} />}
        </div>
    );
}
