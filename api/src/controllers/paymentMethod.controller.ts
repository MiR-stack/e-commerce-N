import { NextFunction, Request, Response } from "express";

import { removeImage, uploadImage } from "@/utils";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  CreatePaymentMethod,
  ImageDataType,
  UpdatePaymentMethod,
} from "@/types";
import {
  createPaymentMethod,
  deltePaymentMethod,
  getPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "@/services/paymentMethod.service";

const createPaymentMethodHandler = async (
  req: Request<{}, {}, CreatePaymentMethod["body"]>,
  res: Response,
  next: NextFunction
) => {
  const imageData = await uploadImage(req.file!, "paymentMethods");

  try {
    if (!imageData) throw new Error("Image upload failed");
    const method = await createPaymentMethod({
      ...req.body,
      image_data: imageData as ImageDataType,
    });

    res.status(201).json(method);
  } catch (error: any) {
    removeImage(imageData, "paymentMethods");
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const getPaymentMethodHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fields = req.query.fields as string;

    const method = await getPaymentMethod(id, fields);

    res.send(method);
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

const getPaymentMethodsHandler = async (req: Request, res: Response) => {
  const fields = req.query.fields as string;

  const methods = await getPaymentMethods(fields);

  res.json(methods);
};

const updatePaymentMethodHandler = async (
  req: Request<{ id: string }, {}, UpdatePaymentMethod["body"]>,
  res: Response,
  next: NextFunction
) => {
  let imageData: Prisma.InputJsonValue | undefined;

  if (req.file) {
    imageData = await uploadImage(req.file, "paymentMethods");
  }
  try {
    const { id } = req.params;

    const updateData: Parameters<typeof updatePaymentMethod>[1] = {
      ...req.body,
    };

    if (imageData) {
      updateData.image_data = imageData as ImageDataType;
    }

    const method = await updatePaymentMethod(id, updateData);
    res.json(method);
  } catch (error: any) {
    if (imageData) {
      removeImage(imageData, "paymentMethods");
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

const deletePaymentMethodHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deltePaymentMethod(req.params.id);
    res.status(204).json({ msg: "payment method deleted successfully" });
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
  createPaymentMethodHandler,
  updatePaymentMethodHandler,
  getPaymentMethodHandler,
  getPaymentMethodsHandler,
  deletePaymentMethodHandler,
};
