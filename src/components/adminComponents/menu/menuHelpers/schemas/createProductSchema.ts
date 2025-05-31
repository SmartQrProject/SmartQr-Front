import { z } from "zod";

export const productSchemaCreate = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(30, "Product name must be maximum 30 characters"),
  description: z.string().min(5, "Description must be at least 5 characters").max(100, "Description must be maximun 100 characters").optional(),
  price: z.coerce.number().min(0.01, "Price must be a positive number").max(99999999.99, "Price must not exceed $99999999.99"),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string().min(1, "Details must be at least 1 character").max(20, "Details must be maximun 20 characters")).optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }),
});


export const productSchemaEdit = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(30, "Product name must be maximum 30 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").max(100, "Description must be maximun 100 characters").optional(),
  price: z.coerce.number().min(0.01, "Price must be a positive number").max(99999999.99, "Price must not exceed $99999999.99").optional(),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string().min(1, "Details must be at least 1 character").max(20, "Details must be maximun 20 characters")).optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }).optional(),
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
