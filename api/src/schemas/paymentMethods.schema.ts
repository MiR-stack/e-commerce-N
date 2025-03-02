import { number, z } from "zod";

const createPaymentMethodSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    number: z.string().min(8, "please provide a valid number"),
    description: z.string().min(3).optional(),
  }),
  file: z.any().refine((file) => !!file, "Image is required"),
});

const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

export { createPaymentMethodSchema, updatePaymentMethodSchema };
export type CreatePaymentMethod = z.TypeOf<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethod = z.TypeOf<typeof updatePaymentMethodSchema>;
