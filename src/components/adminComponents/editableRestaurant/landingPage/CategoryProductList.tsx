"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import { getCategories } from "@/components/adminComponents/menu/menuHelpers/fetch/categories";
import CardView from "@/components/adminComponents/menu/card/CardView";
import ProductModal from "@/components/adminComponents/editableRestaurant/landingPage/ProducModal";
import CreateMenuForm from "@/components/adminComponents/menu/forms/CreateProductForm";
import { ICategoryWithProducts } from "@/components/adminComponents/menu/menuTypes/menuTypes";
import { ProductFormData } from "@/components/adminComponents/menu/menuHelpers/schemas/createProductSchema";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  slug: string;
}

export default function CategoryProductList({ slug }: Props) {
  const { user } = useAuth();
  const token = user?.token;
  const [categories, setCategories] = useState<ICategoryWithProducts[]>([]);
  const [editProduct, setEditProduct] = useState<
    (ProductFormData & { id?: string; image_url?: string }) | null
  >(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const refetchCategories = async () => {
    if (!slug || !token) return;
    try {
      const res = await getCategories(slug, token);
      setCategories(Array.isArray(res?.categories) ? res.categories : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories with products");
    }
  };

  useEffect(() => {
    refetchCategories();
  }, [slug, token]);

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await fetch(`${API}/${slug}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      await refetchCategories();
      toast.success("Product deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <section className="p-4">
      <div className="space-y-10">
        {categories.map((cat) => {
          const filtered =
            cat.products?.filter(
              (product) =>
                (product as any).exist !== false &&
                (product as any).category?.exist !== false
            ) || [];

          return (
            <div key={cat.id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-default-800">
                {cat.name}
              </h3>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col items-stretch gap-2"
                    >
                      <CardView
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        file={
                          typeof product.image_url === "string"
                            ? product.image_url
                            : ""
                        }
                        details={
                          Array.isArray(product.detail) ? product.detail : []
                        }
                        is_available={product.is_available ?? false}
                        categoryId={cat.id}
                      />

                      <div className="flex justify-around gap-3 px-1">
                        <button
                          onClick={() => {
                            setEditProduct({
                              id: String(product.id),
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              available: product.is_available ?? true,
                              categoryId: cat.id,
                              details: product.detail
                                ? product.detail.map((d: any) =>
                                    typeof d === "string" ? d : d.name
                                  )
                                : [],
                              image_url:
                                typeof product.image_url === "string"
                                  ? product.image_url
                                  : "",
                            });
                            setIsProductModalOpen(true);
                          }}
                          title="Edit"
                          className="flex items-center justify-center gap-1 text-sm text-default-800 hover:text-sky-600 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(String(product.id))
                          }
                          className="flex items-center justify-center gap-1 text-sm text-default-800 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No products in this category.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {isProductModalOpen && editProduct && (
        <ProductModal
          open={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditProduct(null);
          }}
        >
          <CreateMenuForm
            mode="edit"
            initialData={editProduct}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditProduct(null);
            }}
            onSuccess={() => {
              refetchCategories();
            }}
          />
        </ProductModal>
      )}
    </section>
  );
}
