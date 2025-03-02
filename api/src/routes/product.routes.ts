import {
  createProduct,
  getProduct,
  getProductDetails,
  updateProduct,
} from "@/controllers";
import {
  getProductsHandler,
  getRelatedProductsHandler,
} from "@/controllers/product.controller";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getProductsHandler);
router.get("/:id", getProduct);
router.get("/:id/related", getRelatedProductsHandler);

// protected routes
router.use(authenticateAdmin);

router.post("/create", hasPermission("product:create"), createProduct);
router.put("/:id", hasPermission("product:update"), updateProduct);
router.get("/:id/details", hasPermission("product:read"), getProductDetails);

export default router;
