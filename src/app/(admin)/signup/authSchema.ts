import { z } from "zod";

const passwordRegex =
  /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/

  

export const AdminRegisterSchema = z
  .object({
    ownerName: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(50, "Name must be at most 50 characters")
      .nonempty({ message: "Name is required" })
      .regex(/^[A-Za-z0-9 ]+$/, {
        message: "Name can only contain letters, numbers, and spaces",
      }),

    email: z
      .string()
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must be at most 100 characters")
      .nonempty({ message: "Email is required" })
      .email("Please enter a valid email address"),

    storeName: z
      .string()
      .min(1, { message: "Store name must be at least 1 character" }).max(50, "Store name must be at most 50 characters"),

    slug: z
      .string()
      .min(5, { message: "Slug must be at least 5 characters" }).max(15, "Slug must be at most 15 characters"),

    password: z
      .string()
      .regex(passwordRegex, {
        message:
          "Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (@$!%?&)",
      }),

    confirmPassword: z
      .string()
      .regex(passwordRegex, {
        message:
          "Confirm Password must be 8 to 15 characters with uppercase, lowercase, number, and special character (@$!%?&)",
      }),

    isTrial: z.coerce.boolean({
      required_error: "Please select a trial option",
    }),

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof AdminRegisterSchema>;

export const loginSchema = z.object({
  email: z.string().nonempty({ message: "Email is required" }).email(),
  password: z.string().nonempty({ message: "Password is required" }).min(8),
});
