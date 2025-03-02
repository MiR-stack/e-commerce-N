// controllers/product.controller.ts
import { NextFunction, Request, Response } from "express";
import {
  getFilteredProducts,
  getRelatedProducts,
} from "../services/product.service";
import { ProductQuery } from "@/types";

export const getProductsHandler = async (
  req: Request<{}, {}, {}, ProductQuery["query"]>,
  res: Response
) => {
  try {
    const result = await getFilteredProducts({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      status: req.query.status,
      quantity: req.query.quantity,
      fields: req.query.fields,
      featured: req.query.featured,
      special: req.query.special,
      category: req.query.category,
      color: req.query.color,
      size: req.query.size,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getRelatedProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 4;

    const relatedProducts = await getRelatedProducts(id, limit);

    res.json({ data: relatedProducts });
  } catch (error) {
    next(error);
  }
};
