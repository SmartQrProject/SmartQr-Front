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
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleCategories = categories.filter(
    (cat) => cat.products && cat.products.length > 0
  );

  const handleScroll = (categoryName: string) => {
    const section = document.getElementById(categoryName);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(categoryName);
    }
  };

 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) setActiveCategory(id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -49% 0px', 
        threshold: 0,
      }
    );

    visibleCategories.forEach((cat) => {
      const section = document.getElementById(cat.name);
      if (section) sectionObserver.observe(section);
    });

    return () => {
      visibleCategories.forEach((cat) => {
        const section = document.getElementById(cat.name);
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, [categories]);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />

      <nav
        className={`${
          isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow bg-white' : ''
        } transition-all`}
      >
        <div className="flex md:justify-center gap-6 overflow-x-auto px-4 py-3 border-b border-gray-100 bg-white whitespace-nowrap">

          {visibleCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleScroll(cat.name)}
              className={`text-sm md:text-base font-semibold whitespace-nowrap pb-1 transition duration-150 ${
                activeCategory === cat.name
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
