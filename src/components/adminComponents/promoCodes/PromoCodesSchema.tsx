import { z } from "zod";

export const schemaPromoCodes = z.object({
  percentage: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1, "Mínimo 1%")
    .max(100, "Máximo 100%"),
    code: z.string().optional(),
});

export type FormPromoCodes = z.infer<typeof schemaPromoCodes>;
