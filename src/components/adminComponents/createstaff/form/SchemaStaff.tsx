import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

export const StaffRegisterSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(100, "Name must be at most 100 characters")
      .regex(/^[A-Za-z0-9 ]+$/, {
        message: "Name can only contain letters, numbers, and spaces",
      }),

    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .email("Please enter a valid email address"),

    slug: z
      .string()
      .optional(),

    password: z
      .string()
      .regex(passwordRegex, {
        message:
          "Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (!@#$%^&*)",
      }),

    confirmPassword: z
      .string()
      .regex(passwordRegex, {
        message:
          "Confirm Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (!@#$%^&*)",
      }),

    role: z.enum(["admin", "staff"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export type StaffFormInputs = z.infer<typeof StaffRegisterSchema>;

