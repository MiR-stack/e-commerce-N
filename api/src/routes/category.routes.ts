import express from "express";
import {
  createCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoryHandler,
} from "../controllers/category.controller";
import { upload } from "@/middlewares/multer";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import basicQuery from "@/middlewares/basicQuery";

const router = express.Router();

router.get("/", basicQuery, getCategoriesHandler);

// protected routes
router.use(authenticateAdmin);

router.post(
  "/",
  hasPermission("category:create"),
  upload.single("file"),
  createCategoryHandler
);

router.get("/:id", hasPermission("category:read"), getCategoryHandler);

router.put(
  "/:id",
  hasPermission("category:update"),
  upload.single("file"),
  updateCategoryHandler
);

router.delete("/:id", hasPermission("category:delete"), deleteCategoryHandler);

export default router;
