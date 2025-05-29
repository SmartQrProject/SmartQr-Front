"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    HiOutlineHome,
    HiOutlineBuildingStorefront,
    HiOutlineCog6Tooth,
    HiOutlineChartBar,
    HiOutlineUserGroup,
    HiOutlineClipboardDocumentList,
    HiOutlineCheckCircle,
} from "react-icons/hi2";
import { GiHamburgerMenu, GiKnifeFork, GiChart } from "react-icons/gi";
import { MdOutlineTableBar } from "react-icons/md";
import { useUserRole } from "../hooks/useUserRole";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { RiCoupon3Line } from "react-icons/ri";

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
                setRestaurantName(parsed.payload.restaurant.name || "Restaurant");
            } catch {
                setRestaurantName("Restaurant");
            }
        }

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (role === undefined) return <div>Loading...</div>;

    if (!validRoles.includes(role as any)) return <div>No autorizado</div>;

    const handleLinkClick = () => {
        if (isMobile) setIsOpen(false);
    };

    const linkClasses = (path: string) => {
        const isActive = path === "/dashboard" ? pathname === "/dashboard" : pathname === path || pathname.startsWith(path + "/");

        return `flex items-center gap-2 py-2 px-4 rounded-3xl hover:bg-gray-300 relative ${isActive ? "font-semibold" : ""}`;
    };

    return (
        <div className={`h-screen bg-white shadow-md transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
            <div className="flex justify-end p-2">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-black transition-transform text-xl">
                    {" "}
                    {isOpen ? <IoChevronBack /> : <IoChevronForward />}
                </button>
            </div>

            <div className="flex flex-col space-y-2 px-2">
                {isOpen && (
                    <div className="px-2 mb-2">
                        <h1 className="font-semibold text-lg truncate">{restaurantName}</h1>
                        <span className="text-sm text-gray-500">Restaurant</span>
                    </div>
                )}

                <Link href="/dashboard" onClick={handleLinkClick} className={linkClasses("/dashboard")}>
                    <HiOutlineHome />
                    {isOpen && <span>Home</span>}
                </Link>

                {role === "owner" && (
                    <>
                        <Link href="/dashboard/store" onClick={handleLinkClick} className={linkClasses("/dashboard/store")}>
                            <HiOutlineBuildingStorefront />
                            {isOpen && <span>Stores</span>}
                        </Link>

                        <Link href="/dashboard/staffcreation" onClick={handleLinkClick} className={linkClasses("/dashboard/staffcreation")}>
                            <HiOutlineUserGroup />
                            {isOpen && <span>Staff Creation</span>}
                        </Link>

                        {/* <Link href="/dashboard/menu/createcategory" onClick={handleLinkClick} className={linkClasses("/dashboard/menu/createcategory")}>
          <GiKnifeFork />
          {isOpen && <span>Menu</span>}
          </Link> */}

                        <Link href="/dashboard/reports" onClick={handleLinkClick} className={linkClasses("/dashboard/reports")}>
                            <HiOutlineChartBar />
                            {isOpen && <span>Reports</span>}
                        </Link>

                        <Link href="/dashboard/promocodes" onClick={handleLinkClick} className={linkClasses("/dashboard/promocodes")}>
                            <RiCoupon3Line />
                            {isOpen && <span>Promo Codes</span>}
                        </Link>
                    </>
                )}

                {(role === "owner" || role === "staff") && (
                    <>
                        <Link href="/dashboard/orders" onClick={handleLinkClick} className={linkClasses("/dashboard/orders")}>
                            <HiOutlineClipboardDocumentList />
                            {isOpen && <span>Orders</span>}
                        </Link>

                        <Link href="/dashboard/completed" onClick={handleLinkClick} className={linkClasses("/dashboard/completed")}>
                            <HiOutlineCheckCircle />
                            {isOpen && <span>Orders Completed</span>}
                        </Link>

                        <Link href="/dashboard/tables" onClick={handleLinkClick} className={linkClasses("/dashboard/tables")}>
                            <MdOutlineTableBar />
                            {isOpen && <span>Tables</span>}
                        </Link>

                        <Link href="/dashboard/settings" onClick={handleLinkClick} className={linkClasses("/dashboard/settings")}>
                            <HiOutlineCog6Tooth />
                            {isOpen && <span>Settings</span>}
                        </Link>
                    </>
                )}

                {role === "superAdmin" && (
                    <>
                        <Link href="/dashboard/restaurants" onClick={handleLinkClick} className={linkClasses("/dashboard/restaurants")}>
                            <GiHamburgerMenu />
                            {isOpen && <span>Restaurant</span>}
                        </Link>
                        <Link href="/dashboard/reportssa" onClick={handleLinkClick} className={linkClasses("/dashboard/reportssa")}>
                            <GiChart />
                            {isOpen && <span>Reports</span>}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default MenuAdmin;

{
    /* <Link href="/dashboard/menu/createcategory" onClick={handleLinkClick} className={linkClasses("/dashboard/menu/createcategory")}>
          <GiKnifeFork />
          {isOpen && <span>Menu</span>}
          </Link> */
}
