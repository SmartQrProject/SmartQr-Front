'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthLinks from '@/components/auth0/AuthLinks';
import PublicStoreInfoModal from '@/components/shared/storeInfoCustomer';

import { StoreIcon, MapPin, ShoppingBagIcon } from 'lucide-react';
import { HiOutlineUser } from 'react-icons/hi';
import { IoRestaurantSharp } from 'react-icons/io5';

interface NavbarCustomerProps {
  slug?: string;
  name?: string;
}

const NavbarCustomer = ({ slug, name }: NavbarCustomerProps) => {
  const pathname = usePathname();

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
    const handleOpenHamburgerMenu = () => setIsMenuOpen(true);
    window.addEventListener('openHamburgerMenu', handleOpenHamburgerMenu);
    return () => window.removeEventListener('openHamburgerMenu', handleOpenHamburgerMenu);
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
        } catch {
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
    return () => window.removeEventListener('customerSessionUpdated', loadSession);
  }, []);

  const handleOpenModal = () => setIsStoreInfoModalOpen(true);
  const handleCloseModal = () => setIsStoreInfoModalOpen(false);

  const displaySlug = slug || localSlug;
  const displayName = name || localName;
  const baseMenuUrl = tableNumber ? `/menu/${displaySlug}?table=${tableNumber}` : `/menu/${displaySlug}`;

  const isActive = (href: string) =>
    pathname === href || pathname.replace(href, '').startsWith('?');

  return (
    <nav className="border-b border-gray-200 text-gray-800 relative">
      <div className="flex items-center justify-between px-4 py-3 md:justify-around">
        
        <Link href={baseMenuUrl} className="flex items-center space-x-3">
          <span className="text-2xl font-semibold flex items-center gap-2">
            <StoreIcon className="w-6 h-6 text-branding-500 hover:text-branding-600" />
            {displayName || 'Store'}
          </span>
        </Link>

        
        <div className="flex items-center gap-4">
         
          <Link
            href={isLoggedIn ? `/customer/dashboard` : '#'}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg transition ${
              !isLoggedIn ? 'opacity-0 pointer-events-none' : ''
            } ${isActive('/customer/dashboard') ? 'bg-gray-100 text-branding-600' : ''}`}
            aria-disabled={!isLoggedIn}
            tabIndex={isLoggedIn ? 0 : -1}
          >
            {customerProfileImg ? (
              <img src={customerProfileImg} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <HiOutlineUser className="text-xl" />
            )}
          </Link>
        
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={`${baseMenuUrl}/cart`}
              className={`w-10 h-10 flex justify-center items-center rounded-lg ${
                isActive(`${baseMenuUrl}/cart`) ? 'bg-gray-100 text-branding-600' : 'hover:text-branding-600'
              }`}
            >
              <ShoppingBagIcon className="text-xl" />
            </Link>

            <Link
              href={baseMenuUrl}
              className={`w-10 h-10 flex justify-center items-center rounded-lg ${
                isActive(baseMenuUrl) ? 'bg-gray-100 text-branding-600' : 'hover:text-branding-600'
              }`}
            >
              <IoRestaurantSharp className="text-xl" />
            </Link>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-900 hover:text-branding-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
      </div>

     
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg z-20 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-semibold text-gray-800 flex items-center gap-2 py-6">
              <StoreIcon className="w-6 h-6 text-branding-500" /> {displayName || 'Store'}
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-800 hover:text-branding-600 text-3xl cursor-pointer mr-4"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>

          <PublicStoreInfoModal open={isStoreInfoModalOpen} onClose={handleCloseModal} slug={displaySlug} />

          <button
            onClick={handleOpenModal}
            className="mt-2 py-2 px-3 rounded-sm hover:text-branding-600 w-full text-left text-neutral-900 flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" /> Store Info
          </button>

          <Link
            href={baseMenuUrl}
            className="mt-2 py-2 px-3 rounded-sm hover:text-branding-600 w-full text-left flex items-center gap-2"
          >
            <IoRestaurantSharp className="w-5 h-5" /> Store Menu
          </Link>

          <Link
            href={`${baseMenuUrl}/cart`}
            className="mt-2 py-2 px-3 rounded-sm hover:text-branding-600 w-full text-left flex items-center gap-2"
          >
            <ShoppingBagIcon className="w-5 h-5" /> Cart
          </Link>

          <div className="flex flex-row gap-3 mt-auto mb-20">
            <AuthLinks />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarCustomer;
