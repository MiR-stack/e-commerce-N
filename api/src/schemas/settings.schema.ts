import { z } from "zod";

const socialMediaSchema = z.object({
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  youtube: z.string().url().optional(),
  fpc: z.string().optional(),
});

const createSettingsSchema = z.object({
  body: z.object({
    websiteName: z.string().min(2),
    description: z.string().optional(),
    logo: z.any().optional(),
    socialMedia: socialMediaSchema,
    contactEmail: z.string().email(),
  }),
});

const updateSettingsSchema = createSettingsSchema.partial();

export { createSettingsSchema, updateSettingsSchema };
export type CreateSettingsInput = z.TypeOf<typeof createSettingsSchema>;
export type UpdateSettingsInput = z.TypeOf<typeof updateSettingsSchema>;
