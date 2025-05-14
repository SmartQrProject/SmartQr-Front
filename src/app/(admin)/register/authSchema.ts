import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().nonempty({ message: "Email is required" }).email(),
    password: z.string().nonempty({ message: "Password is required" }).min(8)
});
export type LoginFormInputs = z.infer<typeof loginSchema>;

export const AdminRegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    restaurantName: z.string().min(2, { message: "Restaurant name must be at least 2 characters" }),
    slug: z.string().min(2, { message: "Slug must be at least 2 characters" }),
    storeName: z.string().min(2, { message: "Store name must be at least 2 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters" }),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormInputs = z.infer<typeof AdminRegisterSchema>;
