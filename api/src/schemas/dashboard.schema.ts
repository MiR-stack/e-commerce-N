import { z } from "zod";

const dashboardStatsSchema = z.object({
  query: z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
});

export { dashboardStatsSchema };
export type DashboardStatsInput = z.TypeOf<typeof dashboardStatsSchema>;
