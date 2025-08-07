import { z } from 'zod';

export const UserProfileSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Name can only contain letters, numbers, and spaces",
    }).optional()
     .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[()\-\d\s]{6,40}$/, "Please enter a valid phone number") 
    .or(z.literal(""))
    .optional(),
  picture: z
  .any({message:"Please enter a valid file" })
  .optional(),
  address: z.union([
    z.object({
      full: z.string().max(200),
      coords: z.tuple([z.number(), z.number()])
    }),
    z.literal("")
  ]).optional()


  
})
  
 
export type UserProfileData = z.infer<typeof UserProfileSchema>;
