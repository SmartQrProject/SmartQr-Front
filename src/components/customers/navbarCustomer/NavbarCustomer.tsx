'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { FiGift, FiShoppingBag } from 'react-icons/fi'

interface NavbarCustomerProps {
  slug: string;
  name: string;
}

const NavbarCustomer = ({name, slug }: NavbarCustomerProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative z-10">
      <div className="max-w-screen-2xl flex items-center justify-between mx-auto p-4">
        <a href={`/menu/${slug}`} className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {name}
          </span>
        </a>

        <div className="flex items-center gap-4">
          <Link href={`/menu/${slug}/cart`} className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-transparent transition">
            <FiShoppingBag className="text-xl" />
          </Link>

          <button className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-transparent transition">
            <FiGift className="text-xl text-black" />
          </button>

          <button
            onClick={toggleMenu}
            type="button"
            className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-hamburger"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
        <div id="navbar-hamburger" className="fixed top-0 right-0 h-full w-1/6 bg-white dark:bg-gray-800 shadow-lg z-20 p-4 flex flex-col justify-start">
          <div>
            <div className="flex items-center justify-between mt-3 pb-3 border-b border-gray-200">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                {name}
              </span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl"
                aria-label="Close menu">&times;</button>
            </div>

              <ul className="flex flex-col font-medium space-y-4 mt-8">
                <li>
                  <a href="#" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-300">
                    Store Info
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-300">
                    Rewards
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-row gap-3 mt-auto mb-20">
              <button onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-100 transition">
                Login
              </button>

              <button onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarCustomer
