import {
  createDeleveryAreaHandler,
  deleteDeleveryAreaHandler,
  getDeleveryAreaHandler,
  getDeleveryAreasHandler,
  updateDeleveryAreaHandler,
} from "@/controllers/deleveryArea.controller";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getDeleveryAreasHandler);

// protected routes
router.use(authenticateAdmin);

router.post(
  "/",
  hasPermission("delvery_area:create"),
  createDeleveryAreaHandler
);
router.patch(
  "/:id",
  hasPermission("delvery_area:update"),
  updateDeleveryAreaHandler
);
router.delete(
  "/:id",
  hasPermission("delvery_area:delete"),
  deleteDeleveryAreaHandler
);
router.get(
  "/:id",
  hasPermission("delvery_area:update"),
  getDeleveryAreaHandler
);

export default router;
