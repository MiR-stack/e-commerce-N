import { Status } from "@prisma/client";
import { z } from "zod";

const createSizeSchema = z.object({
  name: z.string().min(1, "name is required"),
  order: z.number().int().default(0),
  status: z.nativeEnum(Status).optional(),
});

export { createSizeSchema };
export type CreateSize = z.TypeOf<typeof createSizeSchema>;
