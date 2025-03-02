import prisma from "@/prisma";
import { NextFunction, Request, Response } from "express";

const getProductImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product_id = req.params.id;

    const fields = req.query.fields
      ? String(req.query.fields)
          .split(",")
          .reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
          }, {})
      : undefined;

    const productImages = await prisma.productImage.findMany({
      where: { product_id },
      orderBy: {
        order: "desc",
      },
      select: Object.keys(fields || {}).length > 0 ? fields : undefined,
    });

    res.send({
      productImages,
    });
  } catch (error) {
    next(error);
  }
};

export default getProductImages;
