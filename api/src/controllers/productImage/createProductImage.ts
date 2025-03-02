import { Request, Response, NextFunction, RequestHandler } from "express";
import prisma from "@/prisma";
import { removeImage, uploadImage } from "@/utils";

/**
 * Create a product image.
 *
 * Expects a multipart/form-data request with:
 * - A file in `req.file` (handled by Multer)
 * - Other metadata in the request body (productId, isMain, altText, order)
 */
const createProductImage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Ensure an image file is uploaded (Multer stores it in req.file)
  if (!req.file) {
    res.status(400).json({ error: "No image file uploaded" });
    return;
  }
  const imageData = await uploadImage(req.file, "products");

  try {
    const { product_id, isMain, altText, order } = req.body;

    // Create the product image record in the database
    const productImage = await prisma.productImage.create({
      data: {
        product_id,
        image_data: imageData,
        is_main: Boolean(isMain),
        alt_text: altText,
        order: order,
      },
    });

    res.status(201).json(productImage);
    return;
  } catch (error: any) {
    removeImage(imageData, "products");
    next(error);
  }
};

export default createProductImage;
