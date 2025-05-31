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

  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  
  if (data.password && !data.confirmPassword) {
    return false;
  }
  if (data.confirmPassword && !data.password) {
    return false;
  }
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});

export type UserProfileFormInputs = z.infer<typeof UserProfileSchema>; 