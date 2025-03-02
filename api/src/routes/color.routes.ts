import {
  createColorHandler,
  deleteColorHandler,
  getColorsHandler,
} from "@/controllers/color.controller";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getColorsHandler);

// protected routes
router.use(authenticateAdmin);

router.post("/", hasPermission("color:create"), createColorHandler);
router.delete("/:id", hasPermission("color:delete"), deleteColorHandler);

export default router;
