import { z } from "zod";

const emailSchema = z.object({
  sender: z.string().email().optional(),
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
  source: z.string(),
});

export { emailSchema };
export type Email = z.TypeOf<typeof emailSchema>;
