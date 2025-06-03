'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncCustomerSession } from '../fetch/useSyncCustomerSession';

export default function StaticRedirectionCart() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    setSlug(localStorage.getItem('slug'));
    setTableNumber(localStorage.getItem('tableNumber'));
  }, []);

  const sessionReady = useSyncCustomerSession(slug);

  useEffect(() => {
    if (slug && tableNumber && sessionReady) {
      router.push(`/menu/${slug}/cart?table=${tableNumber}`);
    }
  }, [slug, tableNumber, sessionReady]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-100 to-blue-50 text-gray-700">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  );
}
