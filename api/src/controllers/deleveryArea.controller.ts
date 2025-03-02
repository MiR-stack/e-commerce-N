import { createDeleveryAreaSchema, updateDeleveryAreaSchema } from "@/schemas";
import {
  createDeleveryArea,
  deleteDeleveryArea,
  getDeleveryAreas,
  getDeliveryArea,
  updateDeleveryArea,
} from "@/services/deleveryArea.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const createDeleveryAreaHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const parsedBody = await createDeleveryAreaSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.send(parsedBody.error.errors);
      return;
    }

    // create delevery area
    const deleveryArea = await createDeleveryArea(parsedBody.data);

    res.send(deleveryArea);
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

const updateDeleveryAreaHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // validate request body
    const parsedBody = await updateDeleveryAreaSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.send(400).json({ msg: parsedBody.error.errors });
      return;
    }

    // update delevery area
    const deleveryArea = await updateDeleveryArea(id, parsedBody.data);

    res.send(deleveryArea);
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

const deleteDeleveryAreaHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // delete delevery area
    const msg = await deleteDeleveryArea(id);

    res.status(204).json({ msg });
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

const getDeleveryAreasHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(req.query.limit) || 3;
    //   get delevery areas
    const deleveryAreas = await getDeleveryAreas(limit);

    res.send(deleveryAreas);
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

const getDeleveryAreaHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    //   get delevery areas
    const deleveryArea = await getDeliveryArea(id);

    res.send(deleveryArea);
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
  createDeleveryAreaHandler,
  updateDeleveryAreaHandler,
  deleteDeleveryAreaHandler,
  getDeleveryAreasHandler,
  getDeleveryAreaHandler,
};
