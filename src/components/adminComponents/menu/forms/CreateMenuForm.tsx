'use client'

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'
import { useState } from "react"
import { menuSchema, MenuFormData } from "../menuHelpers/schemas/createSchema"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import CardView from "../card/CardView"
import { CgClose } from 'react-icons/cg'
import { formatMenuFormData } from "../menuHelpers/menuHelpers";
import ConfirmDialog from "../menuHelpers/confirm/confirmDialog"

const CreateMenuForm = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<MenuFormData | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const { 
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
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

  const handlePreview = async () => {
  const values = getValues();

  try {
    menuSchema.parse(values);
    toast.success("Preview successfully")
    const imageFile = values.imageFile && values.imageFile[0]
      ? URL.createObjectURL(values.imageFile[0])
      : "";

    setPreview({
      ...values,
      imageFile,
    });

  } catch (error) {
    toast.error("Something went wrong");
  }
};


const onSubmit = async (data: MenuFormData) => {
  setIsLoading(true);
  try {
    setShowConfirm(false)
    const formData = formatMenuFormData(data);
    console.log("DATA", data);
    
    const res = await fetch("/api/menu", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to create menu")

    toast.success("Menu created successfully")

    reset({
      name: "",
      description: "",
      price: 0,
      imageFile: undefined,
      details: [],
      available: false,
      category: 0,
    })

    setPreview(null);
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}

  return (
      <div className="flex flex-col lg:flex-row gap-4 w-full rounded-xl justify-center md:ml-30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-6 rounded-md bg-neutral-100 shadow">
          <h1 className="text-center text-lg">Create Product</h1>

          <div>
            <label>Name</label>
            <input {...register("name")} className="w-full p-2 bg-white rounded-md" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label>Description</label>
            <input {...register("description")} className="w-full p-2 bg-white rounded-md" />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div>
            <label>Price</label>
            <input type="number" step="0.01" {...register("price")} className="w-full p-2 bg-white rounded-md" />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label>Image</label>
            <input type="file" accept="image/*" {...register("imageFile")} className="text-xs w-32 ml-2 p-1 bg-gray-300 rounded-md" />
            {typeof errors.imageFile?.message === 'string' && <p className="text-red-500">{errors.imageFile.message}</p>}
          </div>

          <div>
            <button type="button" onClick={() => append("")} className="w-32 p-1 bg-[#9CA3AF] rounded-md mb-2">+ Add Detail</button>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <input {...register(`details.${index}` as const)} className="w-full p-2 bg-white rounded-md" placeholder={`Detail ${index + 1}`} />
                <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm"><CgClose /></button>
              </div>
            ))}
            {errors.details && <p className="text-red-500">{(errors.details as any).message}</p>}
          </div>

          <div>
            <input type="checkbox" {...register("available")} className="mr-2" />
            <label>Available</label>
            {errors.available && <p className="text-red-500">{errors.available.message}</p>}
          </div>

          <div>
            <label>Category</label>
            <select {...register("category")} className="w-full p-2 bg-white rounded-md" defaultValue="">
              <option value="" disabled>Select a category</option>
              <option value="1">Appetizer</option>
              <option value="2">Main Course</option>
              <option value="3">Dessert</option>
            </select>
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </div>

          <button className="w-full rounded bg-[#1437D1] py-3 px-6 text-sm text-white font-bold hover:bg-[#5C77EF] flex items-center justify-center cursor-pointer"type="button" onClick={handlePreview}>
            Preview
          </button>
          
          <ButtonPrimary type='button' disabled={isSubmitting || isLoading} onClick={() => setShowConfirm(true)}>{isLoading ? "Creating..." : "Create Product"}
          </ButtonPrimary>

          <ConfirmDialog isOpen={showConfirm} title="Confirmation" message="Are you sure you want to create this product?" onConfirm={handleSubmit(onSubmit)} onCancel={() => setShowConfirm(false)}/>

        </form>

        {preview && (
          <div className="w-full max-w-sm p-4">
            <CardView name={preview.name} description={preview.description} price={preview.price} imageFile={preview.imageFile} detail={preview.details} available={preview.available} category={preview.category}/>
          </div>
        
        )}

      </div>
    )
  }

  export default CreateMenuForm