import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  color_id: z.string().optional(),
  size_id: z.string().optional(),
});

export type AddToCart = z.TypeOf<typeof addToCartSchema>;
