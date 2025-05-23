'use client';

import { useState } from 'react';

interface Category {
  name: string;
  products: any[];
}

interface Props {
  categories: Category[];
}

export default function PublicCategoryNav({ categories }: Props) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const visibleCategories = categories.filter(cat => cat.products && cat.products.length > 0);
    const handleScroll = (categoryName: string) => {
    const section = document.getElementById(categoryName);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(categoryName);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-2 bg-white shadow-sm ">
      {visibleCategories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => handleScroll(cat.name)}
          className={`text-sm md:text-base font-semibold whitespace-nowrap pb-1 transition border-b-2 cursor-pointer ml-8 ${
            activeCategory === cat.name ? 'border-black text-black' : 'border-transparent text-gray-700 hover:text-black'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
