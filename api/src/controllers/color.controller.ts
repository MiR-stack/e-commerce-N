import { createColorSchema } from "@/schemas";
import { createColor, deleteColor, getColors } from "@/services/color.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const createColorHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const parsedBody = await createColorSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.send(parsedBody.error.errors);
      return;
    }

    // create color
    const color = await createColor(parsedBody.data, req.admin?.id);

    res.send(color);
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

const deleteColorHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // delete color
    const msg = await deleteColor(id);

    res.send({ msg });
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

const getColorsHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.query.limit) || 3;
    //   get colors
    const colors = await getColors(limit, req.query.fields as string);

    res.send(colors);
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

export { getColorsHandler, deleteColorHandler, createColorHandler };
