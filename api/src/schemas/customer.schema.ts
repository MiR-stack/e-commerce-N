import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(1, "name is required"),
  address: z.string(),
  number: z.string().min(5, "minimum 5 number required"),
});

const updateCustomerSchema = createCustomerSchema.partial();

export { createCustomerSchema, updateCustomerSchema };
export type CreateCustomer = z.TypeOf<typeof createCustomerSchema>;
export type UpdateCustomer = z.TypeOf<typeof updateCustomerSchema>;
