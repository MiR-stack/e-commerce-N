import {
  addToCarthandler,
  clearCartHandler,
  myCartHandler,
} from "@/controllers/cart.controller";
import express from "express";

const router = express.Router();

router.post("/add", addToCarthandler);
router.get("/me", myCartHandler);
router.delete("/clear", clearCartHandler);

export default router;
