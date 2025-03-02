import express from "express";
import {
  getSettingsHandler,
  updateSettingsHandler,
} from "../controllers/settings.controller";
import validateRequest from "../middlewares/validateRequest";
import { updateSettingsSchema } from "../schemas/settings.schema";
import { authenticateAdmin, upload } from "@/middlewares";

const router = express.Router();
router.get("/", getSettingsHandler);

router.use(authenticateAdmin);
router.put(
  "/",
  upload.single("logo"),
  validateRequest(updateSettingsSchema),
  updateSettingsHandler
);

export default router;
