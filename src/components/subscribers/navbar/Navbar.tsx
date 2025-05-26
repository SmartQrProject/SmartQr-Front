'use client'
import { Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const Navbar = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-neutral-50 top-0 z-50">
      <nav className=" px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src={`https://res.cloudinary.com/${cloudName}/image/upload/logo2_jzvw9b.png`}
            alt="SmartQR logo"
            className="h-12 sm:h-16 rounded-lg"
          />
        </Link>

        <div className="hidden sm:flex space-x-6 items-center font-semibold">
          <Link className="hover:text-blue-400" href="/features">Features</Link>
          <Link className="hover:text-blue-400" href="/benefits">Benefits</Link>
          <Link className="hover:text-blue-400" href="/pricing">Pricing</Link>
          <Link
            className="py-2 px-6 bg-[#6494ED] hover:bg-blue-400 text-white rounded-3xl"
            href="/login"
          >
            Sign In
          </Link>
        </div>

        <button
          className="sm:hidden text-sky-700 hover:text-sky-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="sm:hidden flex flex-col items-start px-4 pb-4 space-y-3 text-base font-medium">
          <Link className="hover:text-[#6494ED]" href="/features">Features</Link>
          <Link className="hover:text-[#6494ED]" href="/benefits">Benefits</Link>
          <Link className="hover:text-[#6494ED]" href="/pricing">Pricing</Link>
          <Link
            className="py-2 px-6 bg-[#6494ED] hover:bg-blue-400 text-white rounded-3xl"
            href="/login"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
