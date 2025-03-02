import { Status, Stock_status } from "@prisma/client";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // if not provided, will be generated
  sku: z.string().optional(), // if not provided, will be generated
  description: z.string().optional(),
  base_price: z.number({ invalid_type_error: "Base price must be a number" }),
  sale_price: z.number().optional(),
  stock_quantity: z.number().int().nonnegative().default(0),
  stock_status: z.nativeEnum(Stock_status).default("IN_STOCK"),
  is_featured: z.boolean().default(false),
  is_special: z.boolean().default(false),
  purchase_limit: z.number().int().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  status: z.nativeEnum(Status).default("DRAFT"),
  scheduled_for: z.date().optional(),

  categoryIds: z.array(z.string()).optional(),
  colorIds: z.array(z.string()).optional(),
  sizeIds: z.array(z.string()).optional(),
});

const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    search: z.string().optional(),
    sortBy: z
      .enum(["name", "price", "quantity", "createdAt", "status"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    status: z.enum(["active", "inactive"]).optional(),
    category: z.string().optional(),
    quantity: z.enum(["inStock", "lowStock", "outOfStock"]).optional(),
    fields: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    special: z.coerce.boolean().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
  }),
});

const productUpdateSchema = createProductSchema.partial();

export { createProductSchema, productUpdateSchema, productQuerySchema };
export type ProductQuery = z.TypeOf<typeof productQuerySchema>;
