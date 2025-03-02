import {
  createProductImage,
  deleteProductImage,
  getProductImages,
} from "@/controllers";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import { upload } from "@/middlewares/multer";
import express from "express";

const router = express.Router();

router.get("/:id", getProductImages);

// protected routes
router.use(authenticateAdmin);

router.post(
  "/upload",
  hasPermission("product_image:upload"),
  upload.single("file"),
  createProductImage
);
router.delete(
  "/:id",
  hasPermission("product_image:delete"),
  deleteProductImage
);

export default router;
