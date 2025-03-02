import {
  createSizeHandler,
  deleteSizeHandler,
  getSizesHandler,
} from "@/controllers/size.controller";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getSizesHandler);

// protected routes
router.use(authenticateAdmin);

router.post("/", hasPermission("size:create"), createSizeHandler);
router.delete("/:id", hasPermission("size:delete"), deleteSizeHandler);

export default router;
