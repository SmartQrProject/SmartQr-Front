'use client';

import React, { useState, useEffect } from 'react';
import AuthLinks from '@/components/auth0/AuthLinks';
import { StoreIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { IoRestaurantSharp } from 'react-icons/io5';
import PublicStoreInfoModal from '@/components/shared/storeInfoCustomer';

interface NavbarCustomerProps {
  slug?: string;
  name?: string;
}

const NavbarCustomer = ({ slug, name }: NavbarCustomerProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localSlug, setLocalSlug] = useState('');
  const [localName, setLocalName] = useState('');
  const [customerProfileImg, setCustomerProfileImg] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStoreInfoModalOpen, setIsStoreInfoModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    if (!slug || !name) {
      setLocalSlug(localStorage.getItem('slug') || '');
      setLocalName(localStorage.getItem('storeName') || '');
    }
    const storedTableNumber = localStorage.getItem('tableNumber');
    if (storedTableNumber) setTableNumber(storedTableNumber);
  }, [slug, name]);

  useEffect(() => {
    const handleOpenHamburgerMenu = () => {
      setIsMenuOpen(true);
    };

    window.addEventListener('openHamburgerMenu', handleOpenHamburgerMenu);
    return () => {
      window.removeEventListener('openHamburgerMenu', handleOpenHamburgerMenu);
    };
  }, []);

  useEffect(() => {
    const loadSession = () => {
      const session = localStorage.getItem('customerSession');
      if (session) {
        try {
          const sessionObj = JSON.parse(session);
          const picture = sessionObj?.payload?.picture;
          setCustomerProfileImg(picture || null);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing customerSession', error);
          setIsLoggedIn(false);
          setCustomerProfileImg(null);
        }
      } else {
        setIsLoggedIn(false);
        setCustomerProfileImg(null);
      }
    };

    loadSession();
    window.addEventListener('customerSessionUpdated', loadSession);
    return () => {
      window.removeEventListener('customerSessionUpdated', loadSession);
    };
  }, []);

  const handleOpenModal = () => setIsStoreInfoModalOpen(true);
  const handleCloseModal = () => setIsStoreInfoModalOpen(false);

  const displaySlug = slug || localSlug;
  const displayName = name || localName;

  const baseMenuUrl = tableNumber
    ? `/menu/${displaySlug}?table=${tableNumber}`
    : `/menu/${displaySlug}`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="border-b border-gray-200 text-default-800 relative">
      <div className="flex items-center justify-between p-4">

        <Link href={baseMenuUrl} className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap flex items-center gap-2">
            <StoreIcon className="w-6 h-6 text-sky-800" />
            {displayName || 'Store'}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={isLoggedIn ? `/customer/dashboard` : '#'}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg transition overflow-hidden ${
              !isLoggedIn ? 'opacity-50 pointer-events-none' : ''
            }`}
            aria-disabled={!isLoggedIn}
            tabIndex={isLoggedIn ? 0 : -1}
          >
            {customerProfileImg ? (
              <img src={customerProfileImg} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-transparent">
                <HiOutlineUser className="text-xl text-black" />
              </div>
            )}
          </Link>

          <Link
            href={`${baseMenuUrl}/cart`}
            className="flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg"
          >
            <FiShoppingCart className="text-xl text-black" />
          </Link>

          <Link
            href={baseMenuUrl}
            className="flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg"
            title="Back to Menu"
          >
            <IoRestaurantSharp />
          </Link>

          <button
            onClick={toggleMenu}
            type="button"
            className="flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg text-black"
            aria-controls="navbar-hamburger"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div id="navbar-hamburger" className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-20 p-4 flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <StoreIcon className="w-6 h-6 text-sky-800" /> {displayName || 'Store'}
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-800 hover:text-red-500 text-2xl"
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>

              <button
                onClick={handleOpenModal}
                className="mt-2 py-2 px-3 rounded-sm hover:bg-gray-300 w-full text-left text-gray-800 flex gap-2"
              >
                <MapPin /> Store Info
              </button>

              <PublicStoreInfoModal
                open={isStoreInfoModalOpen}
                onClose={handleCloseModal}
                slug={displaySlug}
              />

              <Link
                href={baseMenuUrl}
                className="mt-2 py-2 px-3 rounded-sm hover:bg-gray-300 w-full text-left text-gray-800 flex gap-2"
              >
                <IoRestaurantSharp /> Store Menu
              </Link>
            </div>

            <div className="flex flex-row gap-3 mt-auto mb-20">
              <AuthLinks />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarCustomer;
