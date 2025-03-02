import prisma from "@/prisma";
import { productUpdateSchema } from "@/schemas";
import { generateSlug } from "@/utils";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Update an existing product.
 */
async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;

    // check if product is exist or not
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ msg: "product not found" });
      return;
    }
    // Validate update data; all fields are optional
    const parsedBody = productUpdateSchema.parse(req.body);

    const {
      name,
      slug,
      sku,
      meta_title,
      description,
      sale_price,
      base_price,
      status,
      stock_quantity,
      stock_status,
      is_featured,
      is_special,
      purchase_limit,
      meta_description,
    } = parsedBody;

    let updateData: any = {
      name,
      slug,
      sku,
      description,
      status,
      base_price,
      sale_price,
      stock_quantity,
      stock_status,
      is_featured,
      is_special,
      purchase_limit,
      meta_title,
      meta_description,
    };

    console.log(status);

    // Optionally, if name is updated and slug is not provided, regenerate slug.
    if (parsedBody.name && !parsedBody.slug) {
      parsedBody.slug = generateSlug(parsedBody.name);
    }

    // handle publishing product
    if (parsedBody.status === "PUBLISED") {
      updateData.published_at = new Date();
    }

    // update relations
    const { categoryIds, colorIds, sizeIds } = parsedBody;

    if (categoryIds) {
      updateData.categories = { set: categoryIds.map((id) => ({ id })) };
    }
    if (colorIds) {
      updateData.colors = { set: colorIds.map((id) => ({ id })) };
    }
    if (sizeIds) {
      updateData.sizes = { set: sizeIds.map((id) => ({ id })) };
    }

    // update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
}

export default updateProduct;
