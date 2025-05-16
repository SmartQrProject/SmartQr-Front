'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "../menuHelpers/schemas/createCategorySchema"; 
import ButtonPrimary from '@/components/buttons/ButtonPrimary';
import { createCategory } from "../menuHelpers/fetch/categories";

const CreateCategoryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

    const onSubmit = async (data: CategoryFormData) => {
  try {
    const slug = "fecho-cafe";

    const session = localStorage.getItem("adminSession");
    if (!session) throw new Error("No session found");

    const { token } = JSON.parse(session);
    if (!token) throw new Error("Token not found");

    const response = await createCategory(token, data, slug);

    if (response.success) {
      alert("Category created successfully");
    } else {
      alert("Error creating category");
    }
  } catch (error) {
    console.error("Error in category creation:", error);
    alert("Error creating category");
  }
};

  

  return (
    <div className='flex flex-col lg:flex-row gap-4 w-full p-6 rounded-xl justify-center space-y-4'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        <h1 className="text-center text-lg font-bold">Create Category</h1>

        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 bg-white rounded-md border border-gray-300"
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <ButtonPrimary type='submit'>Create</ButtonPrimary>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
