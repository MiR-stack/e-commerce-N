import { Status } from "@prisma/client";
import { z } from "zod";

const imageDataSchema = z.object({
  url: z.string(),
  public_id: z.string().optional(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2).optional(),
    parent_id: z.string().optional().nullable(),
    description: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
  }),
  file: z.any().refine((file) => !!file, "Image is required"),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    parent_id: z.string().optional().nullable(),
    description: z.string().optional(),
    status: z.nativeEnum(Status).optional(),
  }),
  file: z.any().optional(),
});

export type CreateCategoryInput = z.TypeOf<typeof createCategorySchema>;
export type UpdateCategoryInput = z.TypeOf<typeof updateCategorySchema>;
export type ImageDataType = z.TypeOf<typeof imageDataSchema>;
