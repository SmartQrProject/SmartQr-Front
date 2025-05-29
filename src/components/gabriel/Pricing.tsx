"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const Pricing = () => {
  return (
    <div className="w-full">
      
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center mb-8 bg-white scroll-smooth">
        
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={`https://res.cloudinary.com/${cloudName}/image/upload/ewsaptveqj6avroghlj3.png`} 
          alt="QR Ordering Hero Large"
          className="absolute inset-0 w-full h-full object-contain hidden lg:block"
        />

        
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={`https://res.cloudinary.com/dsrcokjsp/image/upload/gdpis8dzglhba8ofqitq.png`} 
          alt="QR Ordering Hero Medium"
          className="absolute inset-0 w-full h-full object-contain hidden md:block lg:hidden"
        />

       
        <div className="absolute inset-0 bg-[#4285F4] block md:hidden" />

       
        <div className="absolute inset-0 bg-blue-300/20 z-[1] hidden md:block" />

        
        <div className="relative z-10 text-center text-default-50 md:text-default-900 px-4 md:px-6 ">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Upgrade Your Restaurant Experience
          </motion.h1>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-4 text-base sm:text-lg md:text-xl text-default-900 max-w-2xl mx-auto"
          >
            SmartQR helps you streamline orders, boost efficiency, and delight customers — all with one simple system.
          </motion.p>

          <motion.a
            href="#pricing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="inline-block mt-6 md:bg-[#4285F4] bg-blue-50 text-[#4285F4] md:text-white font-semibold px-6 py-3 rounded-full  md:hover:bg-white md:hover:text-[#4285F4] transition"
          >
            Check Our Services
          </motion.a>

        </div>
      </section>




      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10">
          One powerful plan. Start with a <span className="font-semibold text-[#4285F4]">14-day free trial</span>. No credit card required.
        </p>
      </motion.div>


      <motion.div
        id="pricing"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md shadow-blue-100 p-6 sm:p-10 text-center transition-transform duration-300 transform hover:scale-105 "
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#4285F4] mb-4">Pro Plan – $49/month</h2>
        <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
          Our all-in-one self-ordering system for modern restaurants. Start with a free trial. Cancel anytime.
        </p>

        <ul className="text-left sm:text-center max-w-2xl mx-auto mb-8 space-y-3 text-gray-700 text-sm sm:text-base">
          <li>✔ Digital menu builder with live updates</li>
          <li>✔ Table management and QR code printing</li>
          <li>✔ Staff role creation with dedicated views</li>
          <li>✔ Self-ordering and payments via QR code</li>
          <li>✔ Real-time order dashboard and analytics</li>
          <li>✔ Personalized restaurant landing page</li>
          <li>✔ AI-powered chatbot assistant for restaurant clients</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-[#4285F4] text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/signup"
            className="border border-[#4285F4] text-[#4285F4] px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Subscribe Now
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          After your 14-day trial, continue for $49/month. Cancel anytime before the trial ends to avoid charges.
        </p>
      </motion.div>

  
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mt-20 px-4"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Empowering Restaurants with Smart Technology
        </h3>
        <p className="text-gray-600 mb-10 text-sm sm:text-base">
          Join hundreds of restaurants using SmartQR to streamline service, reduce wait times, and boost satisfaction.
        </p>
      </motion.div>
    </div>
  );
};

export default Pricing;
