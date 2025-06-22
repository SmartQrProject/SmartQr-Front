"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineHome,
  HiOutlineBuildingStorefront,
  HiOutlineCog6Tooth,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import {
  GiHamburgerMenu,
  GiChart
} from "react-icons/gi";
import {
  MdErrorOutline,
  MdOutlineReceipt,
  MdOutlineTableBar
} from "react-icons/md";
import { useUserRole } from "../hooks/useUserRole";
import {
  IoChevronBack,
  IoChevronForward
} from "react-icons/io5";
import { RiCoupon3Line } from "react-icons/ri";

const MenuAdmin = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Restaurant");

  const sidebarRef = useRef<HTMLDivElement>(null);

  const role = useUserRole();
  const validRoles = ["owner", "staff", "superAdmin"] as const;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  if (role === undefined) return null;

  if (!validRoles.includes(role as any)) {
    return (
      <div className="flex items-center gap-2 text-red-600 p-4">
        <MdErrorOutline className="w-5 h-5" />
        <span>Sorry, not authorized</span>
      </div>
    );
  }

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const linkClasses = (path: string) => {
    const isActive =
      path === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === path || pathname.startsWith(path + "/");

    return `flex items-center gap-2 py-2 px-4 hover:text-[#4285F4] relative ${
      isActive ? "font-semibold text-[#0d5ad9]" : ""
    }`;
  };

  return (
    <>
      {!isOpen && isMobile && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-[4.5rem] left-2 z-50 bg-white shadow rounded-full p-1 hover:bg-gray-100"
        >
          <IoChevronForward className="text-blue-600 text-xl" />
        </button>
      )}

      <div
        ref={sidebarRef}
        className={`transition-all duration-300 bg-white shadow-md z-40 min-h-full  
        ${isMobile ? "fixed top-[4rem] left-0" : "sticky top-[4rem]"}
        ${isOpen ? "w-64" : "w-16"} 
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-400 transition-transform text-xl cursor-pointer"
          >
            {isOpen ? <IoChevronBack /> : <IoChevronForward />}
          </button>
        </div>

        <div className="flex flex-col space-y-2 px-2">
          {isOpen && (
            <div className="px-2 mb-2">
              <h1 className="font-bold text-lg truncate text-[#4285F4]">{restaurantName}</h1>
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
              <Link href="/dashboard/reports" onClick={handleLinkClick} className={linkClasses("/dashboard/reports")}>
                <HiOutlineChartBar />
                {isOpen && <span>Reports</span>}
              </Link>
              <Link href="/dashboard/promocodes" onClick={handleLinkClick} className={linkClasses("/dashboard/promocodes")}>
                <RiCoupon3Line />
                {isOpen && <span>Promo Codes</span>}
              </Link>
              <Link href="/dashboard/billing" onClick={handleLinkClick} className={linkClasses("/dashboard/billing")}>
                <MdOutlineReceipt />
                {isOpen && <span>Billing</span>}
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
    </>
  );
};

export default MenuAdmin;
