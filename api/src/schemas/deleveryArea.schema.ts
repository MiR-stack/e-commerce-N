import { Status } from "@prisma/client";
import { z } from "zod";

const createDeleveryAreaSchema = z.object({
  name: z.string().min(1, "name is required"),
  charge: z.coerce.number().int().default(0),
  status: z.nativeEnum(Status),
});

const updateDeleveryAreaSchema = createDeleveryAreaSchema.partial();

export { createDeleveryAreaSchema, updateDeleveryAreaSchema };
export type CreateDeleveryArea = z.TypeOf<typeof createDeleveryAreaSchema>;
export type UpdateDleveryArea = z.TypeOf<typeof updateDeleveryAreaSchema>;
