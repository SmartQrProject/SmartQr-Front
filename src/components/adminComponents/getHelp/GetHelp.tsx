"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    category: "General Use",
    questions: [
      {
        q: "What are the different user roles in the platform?",
        a: "There are two roles: Admin and Staff. Admins have full access, while Staff can only access Orders, Completed Orders, Tables, and Settings.",
      },
      {
        q: "Can I switch roles within the app?",
        a: "No, only Admins can assign roles through the Staff Creation section.",
      },
    ],
  },
  {
    category: "Store Management",
    questions: [
      {
        q: "How do I update my restaurant's banner?",
        a: "Go to the Store section, click the edit banner button, upload your image, and save.",
      },
      {
        q: "How can I add or edit product categories?",
        a: "In the Store view, use the category modal to add, rename, or delete categories.",
      },
      {
        q: "Can I delete a product that’s already in use?",
        a: "Yes, but confirm it's not part of any active order.",
      },
    ],
  },
  {
    category: "Orders Management",
    questions: [
      {
        q: "What are the order statuses?",
        a: "Orders go through: Pending → In Process → Ready to Serve → Completed.",
      },
      {
        q: "Are orders sorted by time?",
        a: "Yes, the oldest ones appear at the top.",
      },
      {
        q: "Can I revert a completed order?",
        a: "Yes, from the Completed Orders view you can move it back to another state.",
      },
    ],
  },
  {
    category: "Reports",
    questions: [
      {
        q: "What reports are available to Admins?",
        a: "Sales summary, top products, top categories, sales frequency, top customers, and new vs returning customers — all with time filters.",
      },
      {
        q: "Can I filter reports by custom dates?",
        a: "Yes, using the calendar selector available in each report.",
      },
    ],
  },
  {
    category: "Staff Management",
    questions: [
      {
        q: "How do I create new staff accounts?",
        a: "Go to Staff Creation and fill out the form. The new staff will get login credentials.",
      },
      {
        q: "Can I delete or modify staff users?",
        a: "Yes, Admins can view and delete users from the list.",
      },
    ],
  },
  {
    category: "Tables Management",
    questions: [
      {
        q: "How can I create a new table?",
        a: "In the Tables section, add a table with a prefix. A unique ID will be generated.",
      },
      {
        q: "Can I rename or delete a table?",
        a: "Yes, but only if the table is active. You can also deactivate it.",
      },
    ],
  },
  {
    category: "Settings",
    questions: [
      {
        q: "Where can I update my profile information?",
        a: "Go to Settings to update your name, email, and other data.",
      },
    ],
  },
];

const GetHelp = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Help Center</h1>

      {faqs.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-3 border-b pb-1">{section.category}</h2>
          {section.questions.map((item, qIdx) => {
            const key = `${idx}-${qIdx}`;
            const isOpen = openItems[key];
            return (
              <div key={key} className="border-b py-3">
                <button
                  onClick={() => toggleItem(key)}
                  className="w-full flex justify-between items-center text-left text-gray-800 font-medium hover:text-blue-600 transition"
                >
                  {item.q}
                  {isOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                </button>
                {isOpen && (
                  <p className="text-gray-600 mt-2 pl-2 text-sm transition-all duration-300">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GetHelp;
