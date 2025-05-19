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
import {  Image, Wheat } from "lucide-react"


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
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex flex-col gap-6 ">

        
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full p-8 rounded-lg bg-default-100 ">
            <h2 className="text-center text-2xl">Create Product</h2>

            <div>
              <label className="font-semibold">Name</label>
              <input {...register("name")} className="w-full p-2 mt-2 bg-white rounded-md" />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <input {...register("description")} className="w-full p-2 mt-2 bg-white rounded-md" />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            <div>
              <label className="font-semibold">Price</label>
              <input type="number" step="0.01" {...register("price")} className="w-full p-2 mt-2 bg-white rounded-md" />
              {errors.price && <p className="text-red-500">{errors.price.message}</p>}
            </div>


            <div>
              <label className="font-semibold">Category</label>
              <select {...register("categoryId")} className="w-full p-2 mt-2 bg-white rounded-md cursor-pointer">
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

            <div>
              <input type="checkbox" {...register("available")} className="mr-2" />
              <label className="font-semibold">Available</label>
              {errors.available && <p className="text-red-500">{errors.available.message}</p>}
            </div>

            <div>
              <label className="font-semibold flex gap-2"> <Image/> Image</label>
              <input type="file" accept="image/*" {...register("file")} className="text-sm font-semibold w flex flex-col w-[200px] p-3 mt-2 text-white bg-default-700  hover:bg-default-800 rounded-md cursor-pointer" />
              {typeof errors.file?.message === 'string' && <p className="text-red-500">{errors.file.message}</p>}
            </div>

            <div>
              <label className="font-semibold flex gap-2"><Wheat/> More</label>
              <button type="button" onClick={() => append("")} className=" p-2 bg-default-700 text-white font-semibold rounded-md mt-2 flex flex-col cursor-pointer">+ Add Detail</button>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <input {...register(`details.${index}` as const)} className="w-full p-2 mt-2 bg-white rounded-md" placeholder={`Gluten Free ${index + 1}`} />
                  <button type="button" onClick={() => remove(index)} className="text-red-500 text-lg font-bold cursor-pointer"><CgClose /></button>
                </div>
              ))}
              {errors.details && <p className="text-red-500">{(errors.details as any).message}</p>}
            </div>

            <button className="w-full rounded bg-default-800 mt-16 py-3 px-6 text-sm text-white font-bold hover:bg-default-700 flex items-center justify-center cursor-pointer"type="button" onClick={handlePreview}>
              Preview
            </button>
            
            
            <button
              type="button"
              className="w-full rounded border-default-800 border-2 py-3 px-6 text-sm text-default-800 font-bold hover:bg-default-700 hover:text-white flex items-center justify-center cursor-pointer"
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
            onConfirm={async() => {
              if (formDataToSubmit) {
                onSubmit(formDataToSubmit);
              }
              setShowConfirm(false);
              toast.success("Product created successfully");
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

      </div>
    )
  }

  export default CreateMenuForm