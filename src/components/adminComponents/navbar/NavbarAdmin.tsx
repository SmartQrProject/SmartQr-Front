"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUserRole } from "../hooks/useUserRole";
import { Menu, Store } from "lucide-react";

const NavbarAdmin = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);

  const { logoutAdmin } = useAuth();
  const router = useRouter();
  const role = useUserRole();
  const validRoles = ["owner", "staff", "superAdmin"] as const;
  const canViewStore = role === "staff" || role === "owner";

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const slug = parsed?.payload?.slug;
        if (slug) setSlug(slug);
      } catch (err) {
        console.error("Invalid session JSON:", err);
      }
    }
  }, []);

  if (role === undefined) return null;
  if (!validRoles.includes(role as any)) return <div>No autorizado</div>;

  const logOutHandler = () => {
    logoutAdmin();
    toast.success("Logout successful");
    router.push("/");
  };

  const storeLink = slug ? `https://www.smart-qr.tech/menu/${slug}` : "#";

  return (
    <div>
      <nav className="py-4 px-8 bg-[#f6f9fe] ">
        <div className="flex justify-between items-center">
          <Link className="font-bold text-xl" href={"/"}>
            <img
              src={`https://res.cloudinary.com/${cloudName}/image/upload/logo2_jzvw9b.png`}
              alt="SmartQR"
              className="h-8 md:h-16 inline-block rounded-lg"
            />
          </Link>
          <button className="sm:hidden text-2xl" onClick={() => setOpen(true)}>
            <Menu />
          </button>

          <div className="hidden sm:flex items-center space-x-4">
            <Link className="py-2 px-4 font-semibold hover:text-branding-500 flex gap-2 items-center" href="/dashboard/gethelp">
              <AiOutlineQuestionCircle className="h-4 w-4" /> Get Help
            </Link>

            {slug && canViewStore && (
              <Link
                className="py-2 px-4 font-semibold hover:text-branding-500 flex gap-2 items-center"
                href={storeLink}
                target="_blank"
              >
                <Store className="h-4 w-4" />Your Store
              </Link>
            )}

            <button
              onClick={logOutHandler}
              className="py-2 px-6 bg-branding-500 text-white rounded-full font-semibold hover:bg-brangig-400 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>

        {open && (
          <div className="sm:hidden fixed top-0 right-0 h-screen w-50 bg-white shadow-sm z-50 p-6">
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)}>
                <IoClose className="text-2xl" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 font-semibold">
              <Link className="py-1 px-4 flex gap-2 items-center" href="/dashboard/gethelp">
                <AiOutlineQuestionCircle className="h-4 w-4" /> Get Help
              </Link>

              {slug && canViewStore && (
                <Link
                  className="py-2 px-4 font-semibold hover:text-blue-400 flex gap-2 items-center"
                  href={storeLink}
                  target="_blank"
                >
                  <Store className="h-4 w-4" />Your Store
                </Link>
              )}

              <button
                onClick={logOutHandler}
                className="w-full py-2 bg-branding-500 text-white rounded-full font-semibold"
              >
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