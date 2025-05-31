import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/

export const StaffRegisterSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(/^[A-Za-z0-9 ]+$/, {
        message: "Name can only contain letters, numbers, and spaces",
      }),

    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must be at most 100 characters")
      .email("Please enter a valid email address"),

    phone: z
    .string()
    .min(6)
    .max(40)
    .regex(/^\+?[()\-\d\s]{6,40}$/, "Please enter a valid phone number")
    .optional(),

    slug: z
      .string()
      .optional(),

    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must be at most 15 characters")
      .regex(passwordRegex, {
        message:
          "Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (!@#$%^&*)",
      }),

    confirmPassword: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(15, "Password must be at most 15 characters")
      .regex(passwordRegex, {
        message:
          "Confirm Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (!@#$%^&*)",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export type StaffFormInputs = z.infer<typeof StaffRegisterSchema>;

