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
            const roleFromSession = parsed.payload?.roles || null;
            const slugFromSession = parsed.payload?.slug || "";
            const tokenFromSession = parsed.token || "";

            setRole(roleFromSession);
            setSlug(slugFromSession);
            setToken(tokenFromSession);

            if (roleFromSession !== "owner") {
                router.push("/login");
            }
        } else {
            router.push("/dashboard");
        }
        setCheckingAuth(false);
    }, [router]);

    const fetchUsers = async () => {
        if (!slug || !token) return;
        try {
            setLoading(true);
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
        if (slug && token) {
            fetchUsers();
        }
    }, [slug, token, page, limit]);

    const totalPages = Math.ceil(total / limit);

    if (checkingAuth) {
        return(
            <div className="flex gap-4 justify-center items-center h-40">
                <p className=" text-sm md:text-2xl text-branding-900">Checking Access...</p>
                <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
         
    }

    if (role !== "owner") {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col mx-auto">
            <NavbarAdmin />
            <div className="flex flex-1 flex-col gap-6 md:flex-row lg:gap-4 ">
                <MenuAdmin />
                <div className="flex-1 p-4">

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/2 w-full">
                            <div className=" rounded-2xl sp-4">
                            <StaffRegisterForm setUsers={setUsers} />
                            </div>
                        </div>
                        <div className="lg:w-2/3 w-full rounded-2xl  p-4 space-y-6">
                            <ListUserResturantView users={users} refreshUsers={fetchUsers} />

                            <div className="flex items-center justify-center gap-2">
                                <label className="text-sm font-medium">Users per page</label>
                                <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-branding-600"
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
                                className="px-4 py-2 bg-branding-600 text-white rounded hover:bg-branding-700 disabled:opacity-50 transition"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                >
                                Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                Page {page} of {totalPages}
                                </span>
                                <button
                                className="px-4 py-2 bg-branding-600 text-white rounded hover:bg-branding-700 disabled:opacity-50 transition"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                >
                                Next
                                </button>
                            </div>
                        </div>

                    </div>
                    {loading && 
                  
                        <div className="flex gap-4 justify-center items-center h-40">
                            <p className=" text-sm md:text-2xl text-branding-900">Loading Users...</p>
                            <div className="w-8 h-8 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    }
                    
                
                    
                </div>
            </div>
            <FooterAdmin />
        </div>
    );
};

export default StaffCreation;

