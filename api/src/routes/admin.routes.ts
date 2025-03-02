import express from "express";
import {
  adminLoginHandler,
  adminRegistrationHandler,
  changeAdminStatusHandler,
  createRoleHandler,
  getAdminHandler,
  resetPasswordHandler,
  updateAdminRoleHandler,
  updateRoleHandler,
} from "../controllers/admin.controller";
import { authenticateAdmin, hasPermission } from "../middlewares";
import { createRoleSchema, updateRoleSchema } from "../schemas/role.schema";
import { validateRequest } from "../middlewares";
import {
  adminLoginSchema,
  adminRegistrationSchema,
  changeAdminStatusSchema,
  resetPasswordSchema,
  updateAdminRoleSchema,
} from "@/schemas";

const router = express.Router();

router.post("/login", validateRequest(adminLoginSchema), adminLoginHandler);
router.get("/me", getAdminHandler);

// Apply authentication and permission checks
router.use(authenticateAdmin);

// create role
router.post(
  "/roles",
  hasPermission("role:create"),
  validateRequest(createRoleSchema),
  createRoleHandler
);

// update role
router.patch(
  "/roles/:id",
  hasPermission("role:update"),
  validateRequest(updateRoleSchema),
  updateRoleHandler
);

// create admin
router.post(
  "/register",
  hasPermission("admin:create"),
  validateRequest(adminRegistrationSchema),
  adminRegistrationHandler
);

// update admin role
router.patch(
  "/:id/update-role",
  hasPermission("admin_role:update"),
  validateRequest(updateAdminRoleSchema),
  updateAdminRoleHandler
);

// change account status
router.patch(
  "/:id/change-status",
  hasPermission("admin_status:change"),
  validateRequest(changeAdminStatusSchema),
  changeAdminStatusHandler
);

// reset password
router.patch(
  "/:id/password-reset",
  validateRequest(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
