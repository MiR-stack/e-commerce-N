import express from "express";
import {
  createOrderHandler,
  getOrdersHandler,
  getOrderHandler,
  updateOrderStatusHandler,
  cancelOrderHandler,
} from "../controllers/order.controller";
import {
  authenticateAdmin,
  currentUser,
  hasPermission,
  isAdmin,
  validateRequest,
} from "../middlewares";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema";

const router = express.Router();

router.post(
  "/",
  currentUser,
  validateRequest(createOrderSchema),
  createOrderHandler
);

router.get("/", isAdmin("order:read"), currentUser, getOrdersHandler);
router.get("/:id", isAdmin("order:read"), currentUser, getOrderHandler);

router.patch(
  "/:id/status",
  authenticateAdmin,
  hasPermission("order:update"),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatusHandler
);
router.delete("/:id", isAdmin("order:update"), currentUser, cancelOrderHandler);

export default router;
