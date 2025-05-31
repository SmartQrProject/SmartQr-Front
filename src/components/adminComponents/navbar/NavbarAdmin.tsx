"use client";
import Link from "next/link";
import React, { useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUserRole } from "../hooks/useUserRole";
import { HamburgerIcon, Menu } from "lucide-react";

const NavbarAdmin = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const [open, setOpen] = useState(false);
    const { logoutAdmin } = useAuth();
    const router = useRouter();
    const role = useUserRole();
    const validRoles = ["owner", "staff", "superAdmin"] as const;
    if (role === undefined) return <div>Loading...</div>;
    if (!validRoles.includes(role as any)) return <div>No autorizado</div>;

    const logOutHandler = () => {
        logoutAdmin();
        toast.success("Logout successful");
        router.push("/");
    };

    return (
        <div>
            <nav className="py-4 px-8 bg-[#f6f9fe]">
                <div className="flex justify-between items-center">
                    <Link className="font-bold text-xl " href={"/"}>
                        <>
                            <img src={`https://res.cloudinary.com/${cloudName}/image/upload/logo2_jzvw9b.png`} alt="SmartQR" className="h-8 md:h-16 inline-block rounded-lg" />
                        </>
                    </Link>
                    <button className="sm:hidden text-2xl" onClick={() => setOpen(true)}>
                        <Menu/>
                    </button>

                    <div className="hidden sm:flex items-center space-x-4">
                        <Link className="py-2 px-4 font-semibold hover:text-[#4285F4] flex items-center" href={"/dashboard/gethelp"}>
                            <AiOutlineQuestionCircle className="mr-2" /> Get Help
                        </Link>

                        {/* {role === 'owner' && (
                            <>
                                <Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/dashboard'}>Dashboard</Link>
                            </>
                            )} */}
                        {/* <Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/'}><HiOutlineBell /></Link> */}
                        <button onClick={logOutHandler} className="py-2 px-6 bg-[#4285F4] text-white rounded-full font-semibold hover:bg-blue-400 cursor-pointer">
                            Log out
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="sm:hidden fixed top-0 right-0 h-screen w-50 bg-white shadow-sm z-50 p-6 transition-transform duration-300 ease-in-out">
                        <div className="flex justify-end items-center mb-6">
                            <button onClick={() => setOpen(false)}>
                                <IoClose className="text-2xl" />
                            </button>
                        </div>

                        <div className="flex flex-col space-y-6 font-semibold">
                            <Link className="py-1 px-4 flex gap-2 items-center" href={"/dashboard/gethelp"}>
                                <AiOutlineQuestionCircle className="mr-2" /> Get Help
                            </Link>
                            {/* <Link className='py-2 px-4 rounded-3xl hover:bg-gray-300 w-30' href={'/'}><HiOutlineBell /></Link> */}
                            {/* {role === 'owner' && (
                                <><Link className='py-2 px-4 rounded-3xl border border-transparent hover:bg-[#9CA3AF] hover:border-white' href={'/dashboard'}>Dashboard</Link></>
                            )} */}
                            <button onClick={logOutHandler} className="w-full py-2 bg-[#4285F4] text-white rounded-full font-semibold">
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default NavbarAdmin;
