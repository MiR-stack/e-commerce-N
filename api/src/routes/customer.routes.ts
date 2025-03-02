import {
  blockCustomerHandler,
  blocksCustomerHandler,
  createCustomerHandler,
  getCustomerByIdHandler,
  getCustomerHandler,
  getCustomersHandler,
  getCustomerStatsHandler,
  getRecentOrdersHandler,
  unblockCustomerHandler,
  updateCustomerHandler,
} from "@/controllers/customer.controller";
import {
  authenticateAdmin,
  currentUser,
  hasPermission,
  isAdmin,
  validateRequest,
} from "@/middlewares";
import { updateCustomerSchema } from "@/schemas";
import express from "express";

const router = express.Router();

router.post("/", createCustomerHandler);

router.get("/me", getCustomerHandler);

router.put(
  "/:id",
  isAdmin("customer:update"),
  currentUser,
  validateRequest(updateCustomerSchema),
  updateCustomerHandler
);

router.use(authenticateAdmin);
router.get(
  "/:id/toggle-block",
  hasPermission("customer:block"),
  blockCustomerHandler
);
router.get("/", hasPermission("customer:read"), getCustomersHandler);

router.get("/:id", hasPermission("customer:read"), getCustomerByIdHandler);
// Customer stats (lifetime spent, avg order, etc.)
router.get(
  "/:id/stats",
  hasPermission("customer:read"),
  getCustomerStatsHandler
);

// Recent orders
router.get(
  "/:id/recent-orders",
  hasPermission("customer:read"),
  getRecentOrdersHandler
);

// Block/unblock
router.post(
  "/:id/block",
  hasPermission("customer:block"),
  blocksCustomerHandler
);
router.post(
  "/:id/unblock",
  hasPermission("customer:update"),
  unblockCustomerHandler
);

export default router;
