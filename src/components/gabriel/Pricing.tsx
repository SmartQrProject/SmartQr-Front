"use client";

import React from "react";
import Link from "next/link";

const plans = [
  {
    title: "Starter",
    description: "One Month FREE for testing.",
    features: [
      "✔ ALL Features available only one month for testing",
      "✔ Meals/Products categories",
      "✔ Interactive digital menu",
      "✔ Personalized landing page",
      "✔ Chatbot based on IA",
      "✔ All Features but for one month only",
    ],
    href: "/signupfree",
    button: "Get Started for Free",
    highlight: false,
  },
  {
    title: "Online Ordering",
    description: "For businesses looking to expand their sales channels.",
    features: [
      "✔ ALL Features available payment month by month",
      "✔ Free Plan features plus",
      "✔ Online and takeaway ordering",
      "✔ Integration with digital payments",
      "✔ Priority support",
      "✔ Monthly subscription",
    ],
    href: "/signupOneMonth",
    button: "300 USD/month",
    highlight: true,
  },
  {
    title: "White-label",
    description: "For brands seeking a fully customized experience.",
    features: [
      "✔ ALL Features available paying one year",
      "✔ Online Orderuing Plan plus",
      "✔ Sales and performance analytics",
      "✔ Custom store URL",
      "✔ Dedicated support and consulting",
      "✔ Full One Year contract",
    ],
    href: "/signupOneYear",
    button: "3.000 USD/year",
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <section className="w-full">
        <img
          src="https://res.cloudinary.com/dsrcokjsp/image/upload/v1747973163/a6tdxavroee1vkrhbosw.png"
          alt="QR Ordering Banner"
          className="w-full h-[400px] object-cover"
        />
      </section>
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple and Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Start for free and choose the plan that best suits your business.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md ${
                plan.highlight ? "border-2 border-blue-600 shadow-lg" : ""
              }`}
            >
              <h2
                className={`text-2xl font-semibold mb-4 ${
                  plan.highlight ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {plan.title}
              </h2>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="text-sm text-gray-700 space-y-2 mb-6 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="inline-block px-5 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
