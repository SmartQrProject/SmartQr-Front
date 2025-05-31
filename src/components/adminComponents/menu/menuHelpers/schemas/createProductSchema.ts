import { z } from "zod";

export const productSchemaCreate = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(30, "Product name must be maximum 30 characters").nonempty({ message: "Product is required" }),
  price: z.coerce.number().min(0.01, "Price must be a positive number").max(99999999.99, "Price must not exceed $99999999.99"),
  description: z.string().min(5, "Description must be at least 5 characters").max(100, "Description must be maximun 100 characters").optional(),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string().min(1, "Details must be at least 1 character").max(20, "Details must be maximum 20 characters")).min(1, "At least 1 detail is required").max(20, "No more than 20 details are allowed").optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }).nonempty({ message: "Category is required" }),
});


export const productSchemaEdit = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(30, "Product name must be maximum 30 characters").nonempty({ message: "Product is required" }).optional(),
  price: z.coerce.number().min(0.01, "Price must be a positive number").max(99999999.99, "Price must not exceed $99999999.99").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").max(100, "Description must be maximun 100 characters").optional(),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string().min(1, "Details must be at least 1 character").max(20, "Details must be maximum 20 characters")).min(1, "At least 1 detail is required").max(20, "No more than 20 details are allowed").optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }).nonempty({ message: "Category is required" }).optional(),
});


export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(30, "Product name must be maximum 30 characters").nonempty({ message: "Product is required" }),
  price: z.coerce.number().min(0.01, "Price must be a positive number").max(99999999.99, "Price must not exceed $99999999.99"),
  description: z.string().min(5, "Description must be at least 5 characters").max(100, "Description must be maximun 100 characters").optional(),
  file: z.any().optional(),
  available: z.boolean().optional(),
  details: z.array(z.string().min(1, "Details must be at least 1 character").max(20, "Details must be maximum 20 characters")).min(1, "At least 1 detail is required").max(20, "No more than 20 details are allowed").optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID format" }).nonempty({ message: "Category is required" }),
});


export type ProductFormData = z.infer<typeof productSchema>;

export type ProductFormDataCreate = z.infer<typeof productSchemaCreate>;
export type ProductFormDataEdit = z.infer<typeof productSchemaEdit>;
