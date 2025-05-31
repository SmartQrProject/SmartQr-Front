import { z } from "zod";

export const categorySchema = z.object({
  name: z
  .string()
  .nonempty({ message: "Category is required" })
  .min(2, "Category must be at least 2 characters")
  .max(30, "Category must be at most 30 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;