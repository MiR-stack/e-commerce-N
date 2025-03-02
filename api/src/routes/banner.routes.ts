import {
  createBannerHandler,
  deleteBannerHandler,
  getBannerHandler,
  getBannersHandler,
  updateBannerHandler,
} from "@/controllers/banner.controller";

import { authenticateAdmin, hasPermission, upload } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getBannersHandler);
router.get("/:id", getBannerHandler);

router.use(authenticateAdmin);

router.post(
  "/create",
  hasPermission("banner:create"),
  upload.single("file"),
  createBannerHandler
);
router.patch(
  "/:id",
  hasPermission("banner:update"),
  upload.single("file"),
  updateBannerHandler
);
router.delete("/:id", hasPermission("banner:delete"), deleteBannerHandler);

export default router;
