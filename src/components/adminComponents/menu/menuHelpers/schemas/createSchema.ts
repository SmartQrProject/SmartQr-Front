import { z } from "zod";

export const menuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be a positive number"),
  imageFile: z.any().refine((files) => files instanceof FileList && files.length > 0 && files[0] instanceof File, { message: "Image is required" }),
  available: z.boolean(),
  details: z.array(z.string().min(1, "Detail cannot be empty")),
  category: z.coerce.number().min(1, "Category is required"),
});

export type MenuFormData = z.infer<typeof menuSchema>;
