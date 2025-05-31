import { z } from "zod";

export const productSchemaCreate = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
  file: z.any().optional(),
  available: z.boolean(),
  details: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "Category is required"),
});


export const productSchemaEdit = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
});


export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
  file: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length > 0 && files[0] instanceof File,
      { message: "Image is required" }
    ),
  available: z.boolean(),
  details: z.array(z.string().min(1, "Detail cannot be empty")),
  categoryId: z.string().min(1, "Category is required"), 
});


export type ProductFormData = z.infer<typeof productSchema>;

export type ProductFormDataCreate = z.infer<typeof productSchemaCreate>;
export type ProductFormDataEdit = z.infer<typeof productSchemaEdit>;
