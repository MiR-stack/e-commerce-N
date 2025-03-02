import { z } from "zod";

const createProductImageSchema = z.object({
  product_id: z.string(),
  isMain: z.boolean().optional().default(false),
  altText: z.string().optional(),
  order: z.number().optional(),
});

export { createProductImageSchema };
