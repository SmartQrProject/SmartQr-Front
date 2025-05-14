'use client'

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';
import { useState } from "react";
import { menuSchema, MenuFormData } from "../menuHelpers/schemas/createSchema";
import ButtonPrimary from "@/components/buttons/ButtonPrimary";

export default function CreateMenuForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      details: [""],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const onSubmit = async (data: MenuFormData) => {
    setIsLoading(true);
    try {

      console.log("DATA", data);

      toast.success("Menu created successfully")

    } catch (error) {
      toast.error("Something went wrong")

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-neutral-100 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <h1 className="text-center">Create Product</h1>
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full p-2 bg-white rounded-md" placeholder="Dish name" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label>Description</label>
          <input {...register("description")} className="w-full p-2 bg-white rounded-md" placeholder="Short description" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input type="number" step="0.01" {...register("price")} className="w-full p-2 bg-white rounded-md " placeholder="12.99" />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label>Image</label>
          <input type="file" accept="image/*" {...register("imageFile")} className="ml-4 text-xs w-32 p-2 bg-[#9CA3AF] rounded-md"/>
          {typeof errors.imageFile?.message === 'string' && (<p className="text-red-500">{errors.imageFile.message}</p>)}
        </div>

        <div>
          <label>Available</label>
          <input type="checkbox" {...register("available")} className="ml-4" />
          {errors.available && <p className="text-red-500">{errors.available.message}</p>}
        </div>
        
        <div>
          <button type="button" onClick={() => append("")} className="w-32 p-1 bg-[#9CA3AF] rounded-md m-2">+ Add Detail</button>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input {...register(`details.${index}` as const)} className="w-full p-2 bg-white rounded-md" placeholder={`Detail ${index + 1}`}/>
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm">❌</button>
            </div>
          ))} {errors.details && ( <p className="text-red-500"> {(errors.details as any).message}</p> )}
        </div>

        <div>
          <label>Category</label>
          <select {...register("category")} className="w-full p-2 bg-white rounded-md " defaultValue="">
            <option  value="" disabled>Select a category</option>
            <option  value="1">Appetizer</option>
            <option  value="2">Main Course</option>
            <option value="3">Dessert</option>
          </select>
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>

        <ButtonPrimary type="submit" disabled={isSubmitting || isLoading}>
          {isLoading ? "Creating..." : "Create Product"}
        </ButtonPrimary>
      </form>
    </div>
  );
}
