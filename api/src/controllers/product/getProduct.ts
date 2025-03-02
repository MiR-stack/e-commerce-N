import prisma from "@/prisma";
import { generateSelectFields } from "@/utils";
import { NextFunction, Request, Response } from "express";

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const fields = req.query.fields;

    const select = fields ? generateSelectFields(fields as string) : undefined;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: String(id) }, { sku: id }],
      },
      select,
    });

    if (!product) {
      res.status(404).json({ msg: "product not found" });
      return;
    }

    res.send(product);
  } catch (err) {
    next(err);
  }
};

export default getProduct;
