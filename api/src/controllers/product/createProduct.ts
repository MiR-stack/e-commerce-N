import prisma from "@/prisma";
import { createProductSchema } from "@/schemas";
import { generateSKU, generateSlug } from "@/utils";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const createProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const parsedBody = createProductSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ error: parsedBody.error.errors });
      return;
    }

    const {
      name,
      slug,
      sku,
      meta_title,
      categoryIds,
      colorIds,
      sizeIds,
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
    } = parsedBody.data;

    let productData: any = {
      name,
      slug,
      sku,
      base_price,
      sale_price,
      stock_quantity,
      stock_status,
      is_featured,
      is_special,
      purchase_limit,
      meta_title,
      meta_description,
      status,
      description,
    };

    // sale price
    if (!sale_price) {
      productData.sale_price = base_price;
    }

    // handle publishing product
    if (status === "PUBLISED") {
      productData.published_at = new Date();
    }

    if (!slug) {
      productData.slug = generateSlug(meta_title || name);
    }

    if (!sku) {
      productData.sku = generateSKU(name);
    }
    // connect realtions
    const categoriesConnect = categoryIds
      ? { connect: categoryIds.map((id: string) => ({ id })) }
      : undefined;
    const colorsConnect = colorIds
      ? { connect: colorIds.map((id: string) => ({ id })) }
      : undefined;
    const sizesConnect = sizeIds
      ? { connect: sizeIds.map((id: string) => ({ id })) }
      : undefined;
    const adminConnect = req.admin?.id
      ? { connect: { id: req.admin.id } }
      : undefined;

    // Create product using Prisma
    const product = await prisma.product.create({
      data: {
        ...productData,
        description: description || "",
        ...(categoriesConnect && { categories: categoriesConnect }),
        ...(colorsConnect && { colors: colorsConnect }),
        ...(sizesConnect && { sizes: sizesConnect }),
        ...(adminConnect && { createdBy: adminConnect }),
      },
      include: {
        categories: true,
        colors: true,
        sizes: true,
      },
    });

    console.log("Product created");
    res.status(201).json(product);
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

export default createProduct;
