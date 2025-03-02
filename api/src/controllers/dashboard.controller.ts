import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";
import { DashboardStatsInput } from "../schemas/dashboard.schema";

export const getDashboardStatsHandler = async (
  _req: Request<{}, {}, {}, DashboardStatsInput["query"]>,
  res: Response
) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};
