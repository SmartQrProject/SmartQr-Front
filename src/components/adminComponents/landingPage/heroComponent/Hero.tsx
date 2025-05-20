'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
          src={`https://res.cloudinary.com/${cloudName}/image/upload/v1747766210/nlec9bsyftwewhlbr3du.png`}
          alt="Background"
          fill
          className="object-contain object-center absolute top-0 left-0 z-0"
          priority
          unoptimized
        />
      )}

      <div className="relative z-10 px-6 sm:px-10 md:px-50 max-w-4xl w-full flex flex-col justify-center">
        <motion.div
          className="text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-default-90 text-4xl md:text-5xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Streamline Your
            <br />
            Restaurant Operations
          </motion.h1>

          <motion.p
            className="text-default-900 text-xl  mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Empower your restaurant with our self-ordering system. Increase efficiency, reduce errors, and delight your customers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              href="/signup"
              className="bg-white text-[#4285F4] text-lg font-bold px-6 py-3 rounded-lg hover:bg-blue-700 hover:text-white transition"
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
