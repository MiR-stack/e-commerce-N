import prisma from "@/prisma";
import axios from "axios";
import { NextFunction, Request, Response } from "express";

const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // find product
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          select: { name: true, id: true },
        },
        colors: {
          select: { name: true, id: true, hex_code: true },
        },
        sizes: {
          select: { name: true, id: true },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        images: { select: { id: true, image_data: true, is_main: true } },
      },
    });

    if (!product) {
      res.status(404).json({ msg: "product not found" });
      return;
    }

    res.send({ ...product });
  } catch (err) {
    next(err);
  }
};

export default getProductDetails;
