"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaffRegisterForm from "@/components/adminComponents/createstaff/form/StaffRegisterForm";
import ListUserResturantView from "@/components/adminComponents/createstaff/listUser.tsx/ListUserResturant";
import FooterAdmin from "@/components/adminComponents/footer/Footer";
import MenuAdmin from "@/components/adminComponents/menudesplegabe/MenuAdmin";
import NavbarAdmin from "@/components/adminComponents/navbar/NavbarAdmin";
import { IUserStaff } from "@/types";
import { getUsers } from "@/components/adminComponents/createstaff/form/fectchUsers";

const LIMIT_OPTIONS = [5, 10, 15, 20];

const StaffCreation = () => {
    const router = useRouter();
    const [users, setUsers] = useState<IUserStaff[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [slug, setSlug] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const session = localStorage.getItem("adminSession");
        if (session) {
            const parsed = JSON.parse(session);
            const roleFromSession = parsed.payload?.role || null;
            const slugFromSession = parsed.payload?.slug || "";
            const tokenFromSession = parsed.token || "";

            setRole(roleFromSession);
            setSlug(slugFromSession);
            setToken(tokenFromSession);

            if (roleFromSession !== "owner") {
                router.push("/admin/dashboard");
            }
        } else {
            router.push("/admin/login");
        }
        setCheckingAuth(false);
    }, [router]);

    const fetchUsers = async () => {
        if (!slug || !token) return;
        try {
            const response = await getUsers(slug, token, page, limit);
            setUsers(response.usuarios || []);
            setTotal(response.total || 0);
        } catch {
            setUsers([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    const totalPages = Math.ceil(total / limit);

    if (checkingAuth) {
        return <p className="p-4 text-center">Checking access...</p>;
    }

    if (role !== "owner") {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavbarAdmin />
            <div className="flex flex-1 flex-col lg:flex-row">
                <MenuAdmin />
                <div className="flex-1 p-4">
                    <h1 className="text-2xl mb-4">User Creation</h1>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                            <StaffRegisterForm setUsers={setUsers} />
                        </div>
                        <div className="lg:w-2/3 bg-white rounded-2xl shadow-md p-6 space-y-6">
                            <ListUserResturantView users={users} refreshUsers={fetchUsers} />
                            <div className="flex items-center justify-end gap-2">
                                <label className="text-sm font-medium">Users per page</label>
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="border rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 "
                                >
                                    {LIMIT_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    {loading && <p className="mt-4">Loading users...</p>}
                </div>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default StaffCreation;
