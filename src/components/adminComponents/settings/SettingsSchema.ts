import { z } from "zod";

export const UserProfileSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Name can only contain letters, numbers, and spaces",
    }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional(),
  address: z
    .string()
    .max(200, "Address must be at most 200 characters")
    .optional(),
});

export type UserProfileFormInputs = z.infer<typeof UserProfileSchema>; 