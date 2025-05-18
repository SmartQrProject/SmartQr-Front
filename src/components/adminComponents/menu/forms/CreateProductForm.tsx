'use client'

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'
import { useState } from "react"
import { ProductFormData, productSchema } from "../menuHelpers/schemas/createProductSchema"
import ButtonPrimary from "@/components/buttons/ButtonPrimary"
import CardView from "../card/CardView"
import { CgClose } from 'react-icons/cg'
import ConfirmDialog from "../menuHelpers/confirm/confirmDialog"
import createProduct, { uploadImage } from "../menuHelpers/fetch/products"
import { useCategories } from "../menuHelpers/hook/useCategories"
import imageCompression from 'browser-image-compression';


export type ProductPreviewData = Omit<ProductFormData, 'file'> & {
  file?: File;     
  imageUrl?: string; 
};


const CreateMenuForm = () => {
  const { categories, error } = useCategories()
  const [formDataToSubmit, setFormDataToSubmit] = useState<ProductFormData | null>(null);

  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

const [preview, setPreview] = useState<ProductPreviewData | null>(null);


  const { 
  register,
  handleSubmit,
  control,
  getValues,
  reset,
  formState: { errors, isSubmitting },
} = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
  defaultValues: {
    details: [""],
    categoryId: "",
  }
});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
    
  });

// PREVIEW
const handlePreview = async () => {
  console.log("👉 Se ejecutó handlePreview");
  
  const values = getValues();

  try {
    productSchema.parse(values);
    toast.success("Preview successfully");
    
    const file = values.file?.[0];
if (file) {
  const imageUrl = URL.createObjectURL(file);
  setPreview({
    ...values,
    file, 
    imageUrl, 
  });
  console.log("Preview", imageUrl);
  console.log("Eli");
  
} else {
  const { file, ...rest } = values; 
  setPreview(rest);
}
  } catch (error) {
    toast.error("Something went wrong");
    console.log("Preview", error);
  }
};

//// ON SUBMIT


const onSubmit = async (data: ProductFormData) => {
  setIsLoading(true);
console.log("👉 Se ejecutó onSubmit");
  try {
    const session = localStorage.getItem("adminSession");
    if (!session) throw new Error("No session found");

    const parsed = JSON.parse(session);
    const token = parsed.token;
    const slug = parsed.payload?.slug;

    const file = data.file?.[0];
    if (!file) {
      toast.error("Image file is required");
      setIsLoading(false);
      return;
    }

   console.log("Archivo original:", file);

const compressedFile = await imageCompression(file, {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 800,
  useWebWorker: true,
});

console.log("Archivo comprimido:", compressedFile);

    const image_url = await uploadImage(compressedFile, token);


    const response = await createProduct({ 
      slug, 
      name: data.name, 
      description: data.description, 
      price: Number(data.price),
      categoryId: data.categoryId, 
      image_url, 
      token,
      is_available: data.available,
      details: data.details, 
    })

    if (response.success) {
      
      toast.success("Product created successfully");
      reset();
      setPreview(null);
      setShowConfirm(false);
    } 
  } catch (error: any) {
  toast.error(error.message || "Something went wrong");
  console.error("❌ Error al crear producto:", error);
} finally {
    setIsLoading(false);
  }
};
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
            <input type="file" accept="image/*" {...register("file")} className="text-xs w-32 ml-2 p-1 bg-gray-300 rounded-md" />
            {typeof errors.file?.message === 'string' && <p className="text-red-500">{errors.file.message}</p>}
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
            <select {...register("categoryId")} className="w-full p-2 bg-white rounded-md">
              <option disabled value="" >Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500">{error}</p>}
            {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
          </div>

          <button className="w-full rounded bg-[#1437D1] py-3 px-6 text-sm text-white font-bold hover:bg-[#5C77EF] flex items-center justify-center cursor-pointer"type="button" onClick={handlePreview}>
            Preview
          </button>
          
          
              <button
                type="button"
                className="w-full rounded bg-green-600 py-3 px-6 text-sm text-white font-bold hover:bg-green-700 flex items-center justify-center cursor-pointer"
                disabled={isLoading || isSubmitting}
                onClick={async () => {
                  try {
                    const values = getValues();
                    productSchema.parse(values);
                    setFormDataToSubmit(values); 
                    setShowConfirm(true); 
                  } catch (error) {
                    toast.error("Please fix form errors before submitting.");
                  }
                }}
              >
                {isLoading ? "Creating..." : "Create Product"}
              </button>
          
                  <ConfirmDialog
          isOpen={showConfirm}
          title="Confirmation"
          message="Are you sure you want to create this product?"
          onConfirm={() => {
            if (formDataToSubmit) {
              onSubmit(formDataToSubmit);
            }
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />


        </form>

        {preview && (
          <div className="w-full max-w-sm p-4">
            <CardView name={preview.name} description={preview.description} price={preview.price} file={preview.imageUrl} details={preview.details} is_available={preview.available} categoryId={preview.categoryId}/>
          </div>
        
        )}

      </div>
    )
  }

  export default CreateMenuForm