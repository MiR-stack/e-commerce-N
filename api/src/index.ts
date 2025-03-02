import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

import productRoutes from "@/routes/product.routes";
import productImageRoutes from "@/routes/productImage.routes";
import categoryRoutes from "@/routes/category.routes";
import colorRoutes from "@/routes/color.routes";
import sizesRoutes from "@/routes/size.routes";
import paymentMethodRoutes from "@/routes/paymentMethod.routes";
import deliveryAreaRoutes from "@/routes/deleveryArea.routes";
import customerRoutes from "@/routes/customer.routes";
// import cartRoutes from "@/routes/cart.routes";
import emailRoutes from "@/routes/email.routes";
import adminRoutes from "@/routes/admin.routes";
import orderRoutes from "@/routes/order.routes";
import bannerRoutes from "@/routes/banner.routes";
import dashboardRoutes from "@/routes/dashboard.routes";
import settingsRoutes from "@/routes/settings.routes";

dotenv.config();

const app = express();

app.use(express.json(), morgan("dev"), cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// helth check
app.use("/helth", (_req, res) => {
  res.status(200).json({ msg: "ok" });
});

// If using disk storage in development, serve the uploads folder statically
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static("uploads"));
}

// routes

app.use("/products", productRoutes);
app.use("/product-images", productImageRoutes);
app.use("/categories", categoryRoutes);
app.use("/colors", colorRoutes);
app.use("/sizes", sizesRoutes);
app.use("/payment-methods", paymentMethodRoutes);
app.use("/delivery-areas", deliveryAreaRoutes);
app.use("/customers", customerRoutes);
// app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/emails", emailRoutes);
app.use("/admins", adminRoutes);
app.use("/banners", bannerRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/settings", settingsRoutes);
// 404 error handle
app.use("*", (_req, res: Response) => {
  res.status(404).json({ msg: "data not found" });
});

// global error handle
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error.stack);

  res.status(error.code || 500).json({ msg: error.message });
});

// runnig server
const port = process.env.PORT || 8080;
const service = process.env.SERVICE || "Product-Service";

app.listen(port, () => {
  console.log(`${service} Running on http://localhost:${port}`);
});
