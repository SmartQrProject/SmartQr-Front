'use client';

import { useState, useEffect, useRef } from 'react';

interface Category {
  name: string;
  products: any[];
}

interface Props {
  categories: Category[];
}

export default function PublicCategoryNav({ categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleCategories = categories.filter(cat => cat.products && cat.products.length > 0);

  const handleScroll = (categoryName: string) => {
    const section = document.getElementById(categoryName);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(categoryName);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />

      <div
        ref={navRef}
        className={`${
          isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-sm bg-white' : ''
        } transition-all`}
      >
        <div className="flex gap-4 overflow-x-auto px-4 py-2 bg-white">
          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleScroll(cat.name)}
              className={`text-sm md:text-base font-semibold whitespace-nowrap pb-1 transition  cursor-pointer ml-8 ${
                activeCategory === cat.name
                  ? ' text-black'
                  : ' text-gray-700 hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
