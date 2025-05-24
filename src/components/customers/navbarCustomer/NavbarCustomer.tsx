'use client'
import AuthLinks from '@/components/auth0/AuthLinks';
import { StoreIcon } from 'lucide-react';
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
    <nav className="border-b border-gray-200 text-default-800 relative">
      <div className=" flex items-center justify-between  p-4">
        <Link href={`/menu/${slug}`} className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap flex items-center gap-2">
            <StoreIcon className="w-6 h-6 text-sky-800" />
            {name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={`/menu/${slug}/cart`} className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-transparent transition">
            <FiShoppingBag className="text-xl " />
          </Link>

          <button className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-transparent transition">
            <FiGift className="text-xl text-black" />
          </button>

          <button
            onClick={toggleMenu}
            type="button"
            className="cursor-pointer flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-200"
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
        <div id="navbar-hamburger" className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-20 p-4 flex flex-col justify-start">

          <div>
            <div className="flex items-center justify-between mt-3 pb-3 border-b border-gray-200">
              <span className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <StoreIcon className="w-6 h-6 text-sky-800" />
                {name}
              </span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-red-500 text-2xl"
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
              
              <AuthLinks />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarCustomer
