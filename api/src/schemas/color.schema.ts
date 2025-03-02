import { Status } from "@prisma/client";
import { z } from "zod";

const createColorSchema = z.object({
  name: z.string().min(1, "name is required"),
  slug: z.string().optional(),
  hex_code: z.string().min(3, "invalid hex code"),
  status: z.nativeEnum(Status).optional(),
});

export { createColorSchema };
export type CreateColor = z.TypeOf<typeof createColorSchema>;
