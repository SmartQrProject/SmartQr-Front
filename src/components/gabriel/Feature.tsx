'use client';

import { motion } from 'framer-motion';

export default function Feature() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const features = [
    {
      title: "Create and Manage Your Menu",
      description:
        "Easily create a digital menu with categories, pictures, pricing, and availability. Add, edit or remove items any time to keep your offerings fresh.",
      image: `https://res.cloudinary.com/${cloudName}/image/upload/i8mkg9h6lxgm3w2grxgg.png`,
    },
    {
      title: "Smart Table Management",
      description:
        "Generate unique QR codes for each table. Customers can scan, browse your menu, and place orders right from their phones. No app required!",
      image: `https://res.cloudinary.com/${cloudName}/image/upload/byxzqxcxmbldwtbtarqz.png`,
    },
    {
      title: "Admin and Staff Dashboards",
      description:
        "Owners have full control with an admin view, while staff can manage daily orders in a streamlined, user-friendly interface designed for fast service.",
      image: `https://res.cloudinary.com/${cloudName}/image/upload/ozlvpokdwjtcd4hsp3dv.png`,
    },
    {
      title: "Sales Reports and Insights",
      description:
        "Track orders, view customer behavior, and analyze top-selling items. Get daily, weekly, or monthly reports to stay on top of your performance.",
      image: `https://res.cloudinary.com/${cloudName}/image/upload/q8geg9yohrui42niml3p.png`,
    },
  ];

  return (
    <main className="mx-auto text-gray-800 font-sans pb-7">
     
      <section className="w-full bg-[#4287F5]">
        <img
          src={`https://res.cloudinary.com/${cloudName}/image/upload/xgcyvjabsqkjqmehq8ca.png`}
          alt="QR Ordering Banner"
          className="w-full h-[300px] md:h-[600px] object-cover lg:object-contain"
        />
      </section>

   
      <section className="text-center my-12 px-4">
        <h2 className="text-4xl font-extrabold mb-4">All Plans. All Features.</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you're starting a cozy café or running a multi-table restaurant,
          our powerful platform has everything you need to serve smarter and sell more.
        </p>
      </section>

      
      <section className="space-y-20 px-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`flex flex-col-reverse md:flex-row ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-10 max-w-6xl mx-auto`}
          >
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-base">{feature.description}</p>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="rounded-xl shadow-lg w-full"
              />
            </motion.div>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
