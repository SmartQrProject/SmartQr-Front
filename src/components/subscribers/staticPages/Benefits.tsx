'use client';

import React from 'react';
import { motion } from 'framer-motion';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const benefits = [
  {
    title: "More revenue, less overhead",
    description:
      "Venues that enable dine-in QR code ordering see up to 30% larger order sizes and up to 25% savings on operational costs.",
    image: `https://res.cloudinary.com/${cloudName}/image/upload/lma8u8i7epj7zv4bcwsw.jpg`, 
  },
  {
    title: "Better experiences on both sides of the counter",
    description:
      "Customers can order and pay from their table using their phone. Staff are freed up to focus on hospitality instead of transactions.",
    image: `https://res.cloudinary.com/${cloudName}/image/upload/dushdkblmwqwaorxxqcb.jpg`,
  },
  {
    title: "Empowered staff, happier guests",
    description:
      "With fewer interruptions and clearer workflows, your team can provide faster service and a more personalized guest experience.",
    image: `https://res.cloudinary.com/${cloudName}/image/upload/hanewg3gr8b9xzstdpkl.jpg`, 
  },
];

const Benefits = () => {
  return (
    <main className="bg-white text-gray-800 font-sans pb-10">
 
      <section className="w-full bg-[#4287F5]">
        <img
          src={`https://res.cloudinary.com/${cloudName}/image/upload/xgcyvjabsqkjqmehq8ca.png`}
          alt="QR Ordering Banner"
          className="w-full h-[300px] md:h-[600px] object-cover lg:object-contain"
        />
      </section>

      
      <section className="text-center my-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          A beautiful, digital, <br />
          dine-in experience.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Increase revenue and save on operational costs with QR code table
          ordering. Allow your staff to focus on the more meaningful interactions.
        </p>
      </section>

      {/* Animated Benefits Section */}
      <section className="space-y-20 px-4">
        {benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col-reverse md:flex-row ${
              idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } items-center gap-10 max-w-6xl mx-auto`}
          >
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{benefit.title}</h2>
              <p className="text-lg text-gray-600">{benefit.description}</p>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img
                src={benefit.image}
                alt={benefit.title}
                className="rounded-xl shadow-lg w-full"
              />
            </motion.div>
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default Benefits;
