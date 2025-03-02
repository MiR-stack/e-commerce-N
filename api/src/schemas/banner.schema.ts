import { z } from "zod";

const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    sub_title: z.string().min(2),
  }),
  file: z.any().refine((file) => !!file, "Image is required"),
});

const updateBannerSchema = createBannerSchema.partial();

export { createBannerSchema, updateBannerSchema };

export type CreateBanner = z.TypeOf<typeof createBannerSchema>;
export type UpdateBanner = z.TypeOf<typeof updateBannerSchema>;
