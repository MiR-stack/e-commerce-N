import { z } from "zod";

// Predefined valid permissions (update this as your services grow)
const VALID_PERMISSIONS = [
  "role:create",
  "role:update",

  // product
  "product:create",
  "product:read",
  "product:update",
  "product:delete",

  // product image
  "product_image:upload",
  "product_image:delete",

  // admin user
  "user:create",
  "user:read",
  "user:update",
  "user:delete",

  // order
  "order:read",
  "order:update",

  // category
  "category:create",
  "category:update",
  "category:delete",
  "category:read",

  // color
  "color:create",
  "color:update",
  "color:delete",

  // size
  "size:create",
  "size:update",
  "size:delete",

  // admin
  "admin:create",
  "admin_role:update",
  "admin_status:change",

  // customer
  "customer:update",
  "customer:block",
  "customer:read",

  // delvery area
  "delvery_area:create",
  "delvery_area:update",
  "delvery_area:read",
  "delvery_area:delete",

  // email
  "email:send",

  // payment method
  "payment_method:create",
  "payment_method:read",
  "payment_method:update",
  "payment_method:delete",

  // banner
  "banner:create",
  "banner:update",
  "banner:delete",
] as const;

const createRoleSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  permissions: z.array(z.enum(VALID_PERMISSIONS)).min(1),
});

const updateRoleSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  permissions: z.array(z.enum(VALID_PERMISSIONS)).optional(),
});

export { createRoleSchema, updateRoleSchema, VALID_PERMISSIONS };
export type CreateRoleInput = z.TypeOf<typeof createRoleSchema>;
export type UpdateRoleInput = z.TypeOf<typeof updateRoleSchema>;
export type ValidPermissions = (typeof VALID_PERMISSIONS)[number];
