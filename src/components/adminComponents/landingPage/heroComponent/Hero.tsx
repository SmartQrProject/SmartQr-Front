'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
    <div className="relative w-full min-h-[500px] flex items-start justify-center bg-[#4285F4] overflow-hidden py-16">
    
      {!isSmallScreen && (
        <Image
          src="/imagenes/banner2.png"
          alt="Background"
          fill
          className="object-contain object-center absolute top-0 left-0 z-0"
          priority
        />
      )}

    
      <div className="relative z-10 px-6 sm:px-10 md:px-50 max-w-4xl w-full flex flex-col justify-center">
        <div className="text-left">
          <h1 className="text-default-90 text-4xl md:text-5xl font-bold leading-tight mb-6">
            Streamline Your
            <br />
            Restaurant Operations
          </h1>
          <p className="text-default-900  text-xl font-semibod mb-12 max-w-md">
            Empower your restaurant with our self-ordering system. Increase efficiency, reduce errors, and delight your customers.
          </p>
          <Link
            href="/signup"
            className="bg-white text-[#4285F4] text-lg font-bold px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
