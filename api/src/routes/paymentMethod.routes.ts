import {
  createPaymentMethodHandler,
  deletePaymentMethodHandler,
  getPaymentMethodHandler,
  getPaymentMethodsHandler,
  updatePaymentMethodHandler,
} from "@/controllers/paymentMethod.controller";

import { authenticateAdmin, hasPermission, upload } from "@/middlewares";
import express from "express";

const router = express.Router();

router.get("/", getPaymentMethodsHandler);

router.use(authenticateAdmin);

router.post(
  "/",
  hasPermission("payment_method:create"),
  upload.single("file"),
  createPaymentMethodHandler
);
router.patch(
  "/:id",
  hasPermission("payment_method:update"),
  upload.single("file"),
  updatePaymentMethodHandler
);
router.get(
  "/:id",
  hasPermission("payment_method:update"),
  getPaymentMethodHandler
);

router.delete(
  "/:id",
  hasPermission("payment_method:delete"),
  deletePaymentMethodHandler
);

export default router;
