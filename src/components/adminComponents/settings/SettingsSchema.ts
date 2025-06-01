import { z } from "zod";

export const UserProfileSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(100, "Name must be at most 100 characters")
      .regex(/^[A-Za-z0-9 ]+$/, {
        message: "Name can only contain letters, numbers, and spaces",
      })
      .optional()
      .or(z.literal("")), // permite string vacío

    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must be at most 15 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      })
      .optional()
      .or(z.literal("")),

    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  );

export type UserProfileFormInputs = z.infer<typeof UserProfileSchema>;
