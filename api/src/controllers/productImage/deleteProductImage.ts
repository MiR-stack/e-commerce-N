import prisma from "@/prisma";
import { removeImage } from "@/utils";
import { Request, Response, RequestHandler, NextFunction } from "express";

/**
 * Delete a product image.
 *
 * Expects the image ID as a URL parameter.
 */
const deleteProductImage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const imageId = req.params.id;
    // Retrieve the product image to get image_data details
    const productImage = await prisma.productImage.findUnique({
      where: { id: imageId },
    });
    if (!productImage) {
      res.status(404).json({ error: "Product image not found" });
      return;
    }

    // Delete the image record from the database
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // Remove the image from storage
    await removeImage(productImage.image_data as any, "products");

    res.status(200).json({ msg: "Product image deleted successfully" });
    return;
  } catch (error: any) {
    next(error);
  }
};

export default deleteProductImage;
