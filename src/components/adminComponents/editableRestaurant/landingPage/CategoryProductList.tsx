'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import { getCategories } from '@/components/adminComponents/menu/menuHelpers/fetch/categories';
import CardView from '@/components/adminComponents/menu/card/CardView';
import { ICategoryWithProducts, IProducts } from '@/components/adminComponents/menu/menuTypes/menuTypes';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  slug: string;
}

export default function CategoryProductList({ slug }: Props) {
  const { user } = useAuth();
  const token = user?.token;

  const [categories, setCategories] = useState<ICategoryWithProducts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug && token) {
          const categoryRes = await getCategories(slug, token);
          setCategories(categoryRes.categories);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load categories with products');
      }
    };

    if (slug && token) fetchData();
  }, [slug, token]);

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;

    try {
      await fetch(`${API}/${slug}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Re-fetch categories to update list
      const categoryRes = await getCategories(slug, token!);
      setCategories(categoryRes.categories);
      toast.success('Product deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <section className="p-4">
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-default-800">{cat.name}</h3>

            {cat.products && cat.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.products.map((product) => (
                  <div key={product.id} className="relative group">
                    <CardView
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      file={typeof product.image_url === 'string' ? product.image_url : ''}
                      details={product.detail ?? []}
                      is_available={product.is_available ?? false}
                      categoryId={cat.id}
                    />

                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => console.log("TODO: Edit product", product)}
                        className="text-default-800 p-1  hover:text-default-700 text-sm cursor-pointer"
                        title="Edit"
                      >
                        <Pencil/>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(String(product.id))}
                        className="text-default-800 p-1  hover:text-default-700 text-sm cursor-pointer"
                        title="Delete"
                      >
                        <Trash2/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No products in this category.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
