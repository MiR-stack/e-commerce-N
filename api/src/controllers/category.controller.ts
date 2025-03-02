import { NextFunction, Request, Response } from "express";
import {
  createCategory,
  getCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
  getCategory,
} from "../services/category.service";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/schemas/category.schema";
import { removeImage, uploadImage } from "@/utils";
import { Prisma, Status } from "@prisma/client";
import { boolean, z } from "zod";

const createCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const imageData = await uploadImage(req.file!, "categories");

  try {
    if (!imageData) throw new Error("Image upload failed");

    const category = await createCategory({
      ...req.body,
      image_data: imageData,
      admin_id: req.admin?.id,
    });

    res.status(201).json(category);
  } catch (error: any) {
    removeImage(imageData, "categories");
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const getCategoryHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fields = req.query.fields as string;

    const category = await getCategory(id, fields);

    res.send(category);
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

const getCategoriesHandler = async (req: Request, res: Response) => {
  const flat = req.query.flat === "true";

  const categories = flat
    ? await getCategories({
        page: req.paginations?.page!,
        limit: req.paginations?.limit!,
        skip: req.paginations?.skip!,
        fields: req.fields,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
        status: req.query.status as Status,
        where: req.where,
        productCount: Boolean(req.query.productCount),
      })
    : await getCategoryTree();
  res.json(categories);
};

const updateCategoryHandler = async (
  req: Request<{ id: string }, {}, UpdateCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  let imageData: Prisma.InputJsonValue | undefined;

  if (req.file) {
    imageData = await uploadImage(req.file, "categories");
  }
  try {
    const { id } = req.params;

    const updateData: Parameters<typeof updateCategory>[1] = {
      ...req.body,
    };

    if (imageData) {
      updateData.image_data = imageData;
    }

    const category = await updateCategory(id, updateData);
    res.json(category);
  } catch (error: any) {
    if (imageData) {
      removeImage(imageData, "categories");
    }

    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const deleteCategoryHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).json({ msg: "category deleted successfully" });
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

export {
  createCategoryHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
};
