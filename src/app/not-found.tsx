"use client";

import { motion } from "framer-motion";
import Link from "next/link";
const partVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3 },
  }),
};

const textVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.2 },
  }),
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="text-center max-w-md w-full">

        <div className="relative mx-auto w-48 h-64 mb-6">

          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-400 rounded-full border-4 border-white"
          />

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute top-24 left-1/2 -translate-x-1/2 w-20 h-32 bg-blue-300 rounded-lg border-4 border-white"
          />

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute top-28 left-0 w-8 h-24 bg-blue-300 rounded-lg border-4 border-white"
          />

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute top-28 right-0 w-8 h-24 bg-blue-300 rounded-lg border-4 border-white"
          />
 
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute bottom-0 left-[25%] w-6 h-20 bg-blue-400 rounded-md border-4 border-white"
          />
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={partVariants}
            className="absolute bottom-0 right-[25%] w-6 h-20 bg-blue-400 rounded-md border-4 border-white"
          />
        </div>

        <div className="mb-6 text-4xl font-extrabold text-gray-800">
          {"404 - Not Found".split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>

        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist. Maybe it was moved or deleted.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
    

