import { z } from 'zod';

export const TradingHoursSchema = z.object({
  mondayToFriday: z.object({
    open: z.string(),
    close: z.string(),
  }),
  saturday: z
    .object({
      open: z.string(),
      close: z.string(),
    })
    .optional(),
  sunday: z
    .object({
      open: z.string(),
      close: z.string(),
    })
    .optional(),
});

export const OrderingTimesSchema = z.object({
  pickup: z.string(),
  dinein: z.string(),
});

export const CompleteRestaurantsSchema = z.object({
  name: z
    .string({
      required_error: 'Restaurant name is required',
    })
    .min(1, 'Restaurant name must be between 1 and 50 characters')
    .max(50, 'Restaurant name must be between 1 and 50 characters'),

  owner_name: z
    .string({
      required_error: 'Owner name is required',
    })
    .min(5, 'Owner name must be between 5 and 50 characters')
    .max(50, 'Owner name must be between 5 and 50 characters')
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: 'This field only permits letters, numbers, and spaces.',
    }),

  slug: z
    .string({
      required_error: 'Restaurant slug is required',
    })
    .min(5, 'Slug must be between 5 and 15 characters')
    .max(15, 'Slug must be between 5 and 15 characters'),

  owner_email: z
    .string({
      required_error: 'Owner email is required',
    })
    .email('Invalid email format')
    .min(5, 'Owner email must be between 5 and 100 characters')
    .max(100, 'Owner email must be between 5 and 100 characters'),

  owner_pass: z
    .string({
      required_error: 'Owner password is required',
    })
    .min(8, 'Password must be between 8 and 15 characters')
    .max(15, 'Password must be between 8 and 15 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,15}$/, {
      message:
        'Password must be 8–15 characters and include uppercase, lowercase, number, and special character (@$!%*?&)',
    }),

  banner: z
    .string()
    .url('Banner must be a valid URL')
    .max(255, 'Image URL must be up to 255 characters')
    .optional(),

  address: z
    .string()
    .min(5, 'Address must be between 5 and 255 characters')
    .max(255, 'Address must be between 5 and 255 characters')
    .optional(),

  phone: z
    .string()
    .min(6, 'Phone number must be between 6 and 40 characters')
    .max(40, 'Phone number must be between 6 and 40 characters')
    .optional(),

  description: z
    .string()
    .min(3, 'Description must be between 3 and 255 characters')
    .max(255, 'Description must be between 3 and 255 characters')
    .optional(),

  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'You can provide up to 10 tags')
    .optional(),

  trading_hours: TradingHoursSchema.optional(),

  ordering_times: OrderingTimesSchema.optional(),

  isTrial: z.boolean().optional(),

  latitude: z
    .number({ invalid_type_error: 'Latitude must be a number' })
    .min(-90)
    .max(90)
    .optional(),

  longitude: z
    .number({ invalid_type_error: 'Longitude must be a number' })
    .min(-180)
    .max(180)
    .optional(),

  is_active: z.boolean().optional(),
});

export type CompleteRestaurantsData = z.infer<typeof CompleteRestaurantsSchema>;