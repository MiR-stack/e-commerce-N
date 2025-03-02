import sendMail from "@/controllers/email.controller";
import { authenticateAdmin, hasPermission } from "@/middlewares";
import express from "express";

const router = express.Router();

router.use(authenticateAdmin);
router.post("/send", hasPermission("email:send"), sendMail);

export default router;
