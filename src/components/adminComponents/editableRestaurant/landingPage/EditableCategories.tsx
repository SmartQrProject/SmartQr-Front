"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/app/(admin)/login/adminLoginContext";
import toast from "react-hot-toast";
import { ICategory } from "@/types/index";
import { getCategories } from "@/components/adminComponents/menu/menuHelpers/fetch/categories";
import { userCreateCategory } from "@/libs/hooks/userCreateCategory";
import AddCategoryModal from "@/components/adminComponents/editableRestaurant/landingPage/AddCategoryModal";
import CreateMenuForm from "../../menu/forms/CreateProductForm";
import ProductModal from "@/components/adminComponents/editableRestaurant/landingPage/ProducModal";

interface EditableCategoriesProps {
  slug: string;
}

export default function EditableCategories({ slug }: EditableCategoriesProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { user } = useAuth();
  const token = user?.token;
  const { createCategory } = userCreateCategory();

  const fetchAllCategories = async () => {
    try {
      const res = await getCategories(slug, token!);
      setCategories(Array.isArray(res.categories) ? res.categories : []);
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    if (token && slug) {
      fetchAllCategories();
    }
  }, [token, slug]);

  const handleCreateCategory = async (name: string) => {
    const newCategory = await createCategory(name);
    if (!newCategory) return;

    await fetchAllCategories();
    toast.success("Category added");
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = confirm("Delete this category?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${slug}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted");
      await fetchAllCategories();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete category");
    }
  };

  const handleEditCategory = async (id: string) => {
    const current = categories.find((c) => String(c.id) === String(id));
    if (!current) return;

    const newName = prompt("Edit category name:", current.name);
    if (!newName || newName.trim() === current.name.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${slug}/categories/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      toast.success("Category updated");
      await fetchAllCategories();
    } catch (err) {
      console.error(err);
      toast.error("Could not update category");
    }
  };

  return (
    <section className="p-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[240px] h-[100px] bg-default-100 rounded-lg p-3 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold truncate text-md">{cat.name}</span>
              <div className="flex gap-1 text-gray-600">
                <button onClick={() => handleEditCategory(String(cat.id))}>
                  <Pencil className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
                </button>
                <button onClick={() => handleDeleteCategory(String(cat.id))}>
                  <Trash2 className="w-4 h-4 hover:text-red-600 cursor-pointer" />
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedCategory(cat);
                setIsProductModalOpen(true);
              }}
              className="mt-2 py-1 text-sm text-white font-semibold bg-default-800 rounded hover:bg-default-700 cursor-pointer"
            >
              Add Product
            </button>
          </div>
        ))}

        <div
          onClick={() => setIsCategoryModalOpen(true)}
          className="min-w-[240px] h-[100px] flex flex-col justify-center items-center border border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-default-100"
        >
          <Plus className="w-6 h-6 mb-1 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            Add Category
          </span>
        </div>
      </div>

      <AddCategoryModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCreateCategory}
      />

      <ProductModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      >
        <CreateMenuForm />
      </ProductModal>
    </section>
  );
}
