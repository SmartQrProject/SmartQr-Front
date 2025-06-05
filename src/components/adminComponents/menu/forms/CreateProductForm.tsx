"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { Check } from "lucide-react";
import { CgClose } from "react-icons/cg";
import CardView from "../card/CardView";
import { useCategories } from "../menuHelpers/hook/useCategories";
import { createProduct } from "../menuHelpers/fetch/createProduct";
import { updateProduct } from "../menuHelpers/fetch/updateProduct";
import { uploadImage } from "../menuHelpers/fetch/uploadImage";
import { ProductFormDataCreate, ProductFormDataEdit, productSchemaCreate, productSchemaEdit } from "../menuHelpers/schemas/createProductSchema";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface Props {
    initialData?: ProductFormDataCreate & { id?: string; image_url?: string };
    mode?: "create" | "edit";
    onClose?: () => void;
    onSuccess?: () => void;
    refetchCategories?: () => void;
}

export default function CreateMenuForm({ initialData, mode = "create", onClose, onSuccess, refetchCategories }: Props) {
    const { categories } = useCategories();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);

    const isEdit = mode === "edit";

    const {
        register,
        handleSubmit,
        control,
        getValues,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormDataCreate | ProductFormDataEdit>({
        resolver: zodResolver(isEdit ? productSchemaEdit : productSchemaCreate),
        mode: "onChange",
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            available: initialData?.available ?? true,
            details: initialData?.details?.length ? initialData.details : [],
            categoryId: initialData?.categoryId || "",
            file: undefined,
        },
    });

  useEffect(() => {
   
  }, [errors]);
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // console.log("Form errors:", errors);
        }
    }, [errors]);

    const { fields, append, remove, replace } = useFieldArray({ control, name: "details" as any });
    const fileSelected = !!watch("file");
    const selectedFileName = watch("file")?.name || "";

    useEffect(() => {
      if (initialData && categories.length > 0) {
        const details = initialData.details?.length ? initialData.details : [];
        reset({
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          available: initialData.available,
          categoryId: initialData.categoryId ?? '',
          details,
        });

        setValue('categoryId', initialData.categoryId ?? '');
        replace(details);
      }
    }, [initialData, categories, reset, replace, setValue]);


    const handlePreview = async () => {
        const values = getValues();
        const file = values.file;

        let imageUrl = initialData?.image_url || "";
        if (file instanceof File) {
            imageUrl = URL.createObjectURL(file);
        }

        setPreview({ ...values, imageUrl });
        toast.success("Preview ready");
    };

    const onSubmit = async (data: ProductFormDataCreate | ProductFormDataEdit) => {
        setIsLoading(true);
        try {
            const cleanedDetails = data.details?.filter((d) => d.trim().length > 0) ?? [];

            const session = localStorage.getItem("adminSession");
            if (!session) throw new Error("No session");
            const {
                token,
                payload: { slug },
            } = JSON.parse(session);

            let image_url = initialData?.image_url || "";
            const file = (data as ProductFormDataCreate).file;
            if (file instanceof File) {
                const compressed = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 800 });
                image_url = await uploadImage(compressed, token);
            }

            if (mode === "edit" && initialData?.id) {
                const updatePayload = {
                    productId: initialData.id,
                    slug,
                    token,
                    name: data.name ?? initialData.name ?? "",
                    description: data.description ?? initialData.description ?? "",
                    price: data.price ?? initialData.price ?? 0,
                    categoryId: data.categoryId ?? initialData.categoryId ?? "",
                    image_url,
                    is_available: data.available ?? initialData.available ?? true,
                    details: cleanedDetails,
                };
                await updateProduct(updatePayload);
                toast.success("Product updated");
            } else {
                const createPayload = {
                    slug,
                    token,
                    name: data.name ?? "",
                    description: data.description ?? "",
                    price: data.price ?? 0,
                    categoryId: data.categoryId ?? "",
                    image_url,
                    is_available: data.available ?? true,
                    details: cleanedDetails,
                };
                await createProduct(createPayload);
                toast.success("Product created");
                reset();
                replace([""]);
            }

            refetchCategories?.();
            onSuccess?.();
            onClose?.();
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full p-8 rounded-lg bg-default-100">
                <h2 className="text-center text-2xl">{mode === "edit" ? "Edit Product" : "Create Product"}</h2>

                <label className="font-semibold">Product Name</label>
                <input {...register("name")} placeholder="Name" className="w-full p-2 bg-white rounded mt-2" />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                <label className="font-semibold">Description</label>
                <input {...register("description")} placeholder="Description" className="w-full p-2 bg-white rounded mt-2" />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                <label className="font-semibold">Price</label>
                <input type="number" step="0.01" {...register("price")} placeholder="Price" className="w-full p-2 bg-white rounded mt-2" />
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}

                <label className="font-semibold">Category</label>
                <select {...register("categoryId")} className="w-full p-2 bg-white rounded mt-2 cursor-pointer">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}

                <label className="flex gap-2 items-center">
                    <input type="checkbox" {...register("available")} className="cursor-pointer" /> Available
                </label>

                <div className="flex flex-col gap-2">
                    <label
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Add a product photo"
                        htmlFor="imageUpload"
                        className={`cursor-pointer flex items-center justify-center gap-2 p-2 rounded-2xl transition-colors border-2 border-dashed
              ${fileSelected ? "bg-green-100 border-green-500" : "bg-gray-100 border-gray-400 hover:bg-gray-200"}
            `}
                    >
                        <img className={`w-5 h-5 ${fileSelected ? "text-green-600" : "text-gray-600"}`} />
                        <span className={`font-medium ${fileSelected ? "text-green-700" : "text-gray-700"}`}>{fileSelected ? "Image selected" : "Click to upload an image"}</span>
                    </label>

                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setValue("file", file, { shouldValidate: true });
                        }}
                        className="hidden"
                    />

                    {errors.file && <p className="text-red-500 text-sm">{errors.file.message as string}</p>}

                    {fileSelected && (
                        <span className="text-sm text-green-700 font-medium truncate flex gap-2">
                            <Check /> {selectedFileName}
                        </span>
                    )}

                    {!fileSelected && preview?.imageUrl && <img src={preview.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-300 shadow" />}
                </div>

                <div>
                    <label className="font-semibold flex gap-2 mb-2">Tags</label>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-place="top"
                        data-tooltip-content="The chatbot is powered by the tags"
                        type="button"
                        onClick={() => append("")}
                        className="mb-2 mt-4 bg-default-700 text-white px-2 py-1 rounded cursor-pointer"
                    >
                        + Add Tags
                    </button>
                    {fields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2 mb-2">
                            <input {...register(`details.${idx}` as const)} className="w-full bg-white p-2 rounded" />
                            <button className="cursor-pointer" type="button" onClick={() => remove(idx)}>
                                <CgClose />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="To see the product preview"
                        type="button"
                        onClick={handlePreview}
                        className="w-full bg-default-800 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Preview
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full border-2 border-default-800 px-4 py-2 rounded text-default-800 font-bold hover:bg-default-700 hover:text-white cursor-pointer"
                    >
                        {isLoading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>

            <Tooltip id="my-tooltip" variant="light" place="top" offset={16} />

            {preview && (
                <div className="mt-6">
                    <CardView
                        name={preview.name}
                        description={preview.description}
                        price={preview.price}
                        file={preview.imageUrl}
                        details={Array.isArray(preview.details) ? preview.details : []}
                        is_available={preview.available}
                        categoryId={preview.categoryId}
                    />
                </div>
            )}
        </div>
    );
}
