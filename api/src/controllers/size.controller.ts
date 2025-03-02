import { createSizeSchema } from "@/schemas";
import { createSize, deleteSize, getSizes } from "@/services/size.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const createSizeHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const parsedBody = await createSizeSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.send(parsedBody.error.errors);
      return;
    }

    // create size
    const size = await createSize(parsedBody.data, req.admin?.id);

    res.send(size);
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

const deleteSizeHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // delete size
    const msg = await deleteSize(id);

    res.send(msg);
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

const getSizesHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fields = String(req.query.fields);
    //   get sizes
    const sizes = await getSizes(fields);

    res.send(sizes);
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

export { createSizeHandler, deleteSizeHandler, getSizesHandler };
