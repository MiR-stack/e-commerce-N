import express from "express";
import { getDashboardStatsHandler } from "../controllers/dashboard.controller";
import validateRequest from "../middlewares/validateRequest";
import { dashboardStatsSchema } from "../schemas/dashboard.schema";
import { authenticateAdmin } from "@/middlewares";

const router = express.Router();

router.get(
  "/stats",
  authenticateAdmin,
  validateRequest(dashboardStatsSchema),
  getDashboardStatsHandler
);

export default router;
