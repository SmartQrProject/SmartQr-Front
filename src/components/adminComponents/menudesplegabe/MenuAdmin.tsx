"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineBuildingStorefront, HiOutlineCog6Tooth, HiOutlineChartBar, HiOutlineUserGroup } from "react-icons/hi2";
import { GiKnifeFork } from "react-icons/gi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useUserRole } from "../hooks/useUserRole";

const MenuAdmin = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [restaurantName, setRestaurantName] = useState("Restaurant");

    const role = useUserRole();
    const validRoles = ["owner", "staff", "superAdmin"] as const;

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        const session = localStorage.getItem("adminSession");
        if (session) {
            try {
                const parsed = JSON.parse(session);
                setRestaurantName(parsed.payload?.restaurant?.name || "Restaurant");
            } catch {
                setRestaurantName("Restaurant");
            }
        }

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (role === undefined) return <div>Loading...</div>;

    if (!validRoles.includes(role as any)) return <div>Unauthorized</div>;

    const handleLinkClick = () => {
        if (isMobile) setIsOpen(false);
    };

    const linkClasses = (path: string) => {
        const isActive = path === "/dashboard" ? pathname === "/dashboard" : pathname === path || pathname.startsWith(path + "/");

        return `flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-gray-300 relative ${isActive ? "font-semibold" : ""}`;
    };

    return (
        <div className="w-full sm:w-64 p-4 bg-white shadow-md rounded-md">
            <div className="flex flex-col space-y-2">
                <div className={`flex justify-between items-center cursor-pointer ${isMobile ? "" : "pointer-events-none"}`} onClick={() => isMobile && setIsOpen(!isOpen)}>
                    <div>
                        <h1 className="font-semibold text-lg">{restaurantName}</h1>
                        <span className="text-sm text-gray-500">Restaurant</span>
                    </div>
                    {isMobile && (isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                </div>

                {isOpen && (
                    <div className="flex flex-col space-y-2 pt-2">
                        <Link href="/dashboard" onClick={handleLinkClick} className={linkClasses("/dashboard")}>
                            {pathname === "/dashboard" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                            <HiOutlineHome /> Home
                        </Link>

                        {role === "superAdmin" && (
                            <>
                                {/* SUPERADMIN LINKS HERE */}
                                <Link href="/dashboard/restaurants" onClick={handleLinkClick} className={linkClasses("/dashboard/restaurants")}>
                                    {pathname === "/dashboard/restaurants" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                                    <HiOutlineCog6Tooth /> Restaurants
                                </Link>
                            </>
                        )}
                        {role === "owner" && (
                            <>
                                <Link href="/dashboard/staffcreation" onClick={handleLinkClick} className={linkClasses("/dashboard/staffcreation")}>
                                    {pathname === "/dashboard/staffcreation" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                                    <HiOutlineUserGroup /> User Creation
                                </Link>

                                <Link href="/dashboard/store" onClick={handleLinkClick} className={linkClasses("/dashboard/store")}>
                                    {pathname === "/dashboard/store" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                                    <HiOutlineBuildingStorefront /> Stores
                                </Link>

                                <Link href="/dashboard/menu/createcategory" onClick={handleLinkClick} className={linkClasses("/dashboard/menu/createcategory")}>
                                    {pathname === "/dashboard/menu/createcategory" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                                    <GiKnifeFork /> Menu
                                </Link>

                                <Link href="/dashboard/reports" onClick={handleLinkClick} className={linkClasses("/dashboard/reports")}>
                                    {pathname === "/dashboard/reports" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                                    <HiOutlineChartBar /> Reports
                                </Link>
                            </>
                        )}

                        {/* Visible para owner y staff */}
                        <Link href="/dashboard/tables" onClick={handleLinkClick} className={linkClasses("/dashboard/tables")}>
                            {pathname === "/dashboard/tables" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                            <HiOutlineShoppingBag /> Tables
                        </Link>

                        <Link href="/dashboard/orders" onClick={handleLinkClick} className={linkClasses("/dashboard/orders")}>
                            {pathname === "/dashboard/orders" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                            <HiOutlineCog6Tooth /> Orders
                        </Link>

                        <Link href="/dashboard/completed" onClick={handleLinkClick} className={linkClasses("/dashboard/completed")}>
                            {pathname === "/dashboard/completed" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                            <HiOutlineCog6Tooth /> Orders Completed
                        </Link>

                        <Link href="/dashboard/settings" onClick={handleLinkClick} className={linkClasses("/dashboard/settings")}>
                            {pathname === "/dashboard/settings" && <div className="absolute left-0 top-2 bottom-2 w-1 bg-black" />}
                            <HiOutlineCog6Tooth /> Settings
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuAdmin;
