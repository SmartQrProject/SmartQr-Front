import { z } from 'zod';

export const UserProfileSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Name can only contain letters, numbers, and spaces",
    }).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional(),
  password: z.string()
  .min(8, "Password must be between 8 and 15 characters")
  .max(15, "Password must be between 8 and 15 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)")
  .optional(),
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
export type UserProfileData = z.infer<typeof UserProfileSchema>;
