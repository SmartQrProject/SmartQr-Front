'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

export default function StaticLogoutPage() {
  const router = useRouter();
  const [counter, setCounter] = useState(10);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [slug, setSlug] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    setSlug(localStorage.getItem('slug'));
    setTableNumber(localStorage.getItem('tableNumber'));
    setStoreName(localStorage.getItem('storeName'));
  }, []);

  useEffect(() => {
    function updateSize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Contador y redirección
  useEffect(() => {
    if (counter <= 0 && slug && tableNumber) {
      router.push(`/menu/${slug}?table=${tableNumber}`);
      return;
    }
    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter, router, slug, tableNumber]);

  if (!slug || !tableNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 to-blue-50 text-gray-700">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-gray-100 to-blue-50 p-6 relative overflow-hidden">
      {/* Confetti con colores profesionales */}
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={counter > 0}
        numberOfPieces={150}
        colors={['#1e293b', '#475569', '#bfa058']}
      />

      <motion.div
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-12 max-w-sm w-full shadow-lg border border-gray-300 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-6"
          style={{ color: '#1e293b' }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          🎉 Goodbye! 🎉
        </motion.h1>

        <p className="mb-6 text-center font-semibold text-gray-700 text-lg">
          Thanks for visiting <span className="underline text-gray-900">{storeName}</span>.
        </p>

        <motion.div
          key={counter}
          className="text-8xl font-extrabold select-none mb-6"
          style={{ color: '#2563eb' }}
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 12, -12, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {counter}
        </motion.div>

        <p className="text-gray-800 text-center mb-4 font-medium">
          Redirecting to table <span className="font-bold">{tableNumber}</span>...
        </p>

        <p className="text-sm text-gray-600">
          If you are not redirected automatically,{' '}
          <a
            href={`/menu/${slug}?table=${tableNumber}`}
            className="underline text-gray-800 hover:text-yellow-600 transition-colors"
          >
            click here
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
