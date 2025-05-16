'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/(admin)/login/adminLoginContext';

type Category = {
  id: string;
  name: string;
};

interface EditableCategoriesProps {
  slug: string;
}

export default function EditableCategories({ slug }: EditableCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { user } = useAuth();
  const token = user?.token;

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/restaurant/${slug}?page=1&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch categories');

        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    if (token && slug) {
      fetchCategories();
    }
  }, [token, slug]);

  const createCategory = async (name: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/restaurant/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error('Failed to create category');

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      alert('Error creating category');
      return null;
    }
  };

  const handleEditCategory = (id: string) => {
    const current = categories.find((c) => c.id === id);
    if (!current) return;
    const name = prompt('Edit category name:', current.name);
    if (!name) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    const confirmed = confirm('Delete this category?');
    if (!confirmed) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="mt-6">
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[240px] h-[60px] bg-default-100 rounded-lg p-2 flex flex-col justify-between"
          >
            <span className="font-semibold truncate text-center">{cat.name}</span>
            <div className="flex gap-2 justify-end text-gray-700">
              <button onClick={() => handleEditCategory(cat.id)}>
                <Pencil className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
              </button>
              <button onClick={() => handleDeleteCategory(cat.id)}>
                <Trash2 className="w-4 h-4 hover:text-red-600 cursor-pointer" />
              </button>
            </div>
          </div>
        ))}

        <div className="min-w-[240px] h-[120px] flex flex-col justify-between border border-dashed rounded px-2 py-3 ml-5">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category"
            className="text-sm px-3 py-3 border-0 rounded-lg bg-default-100/80"
          />
          <button
            onClick={async () => {
              if (!newCategoryName.trim()) return;
              const newCategory = await createCategory(newCategoryName.trim());
              if (!newCategory) return;

              setCategories((prev) => [
                ...prev,
                { id: newCategory.id, name: newCategory.name },
              ]);
              setNewCategoryName('');
            }}
            className="text-default-50 text-md font-semibold mt-1 flex justify-center items-center p-2 bg-sage-500 rounded-lg gap-1 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  );
}
