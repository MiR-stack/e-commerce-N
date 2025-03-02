import { NextFunction, Request, Response } from "express";

import { removeImage, uploadImage } from "@/utils";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { CreateBanner, UpdateBanner } from "@/types";
import {
  createBanner,
  deleteBanner,
  getBanner,
  getBanners,
  updateBanner,
} from "@/services/banner.service";
import { ImageDataType } from "@/types";

const createBannerHandler = async (
  req: Request<{}, {}, CreateBanner["body"]>,
  res: Response,
  next: NextFunction
) => {
  const imageData = await uploadImage(req.file!, "banners");

  try {
    if (!imageData) throw new Error("Image upload failed");
    const banner = await createBanner({
      ...req.body,
      image_data: imageData as ImageDataType,
      adminId: req.admin?.id!,
    });

    res.status(201).json(banner);
  } catch (error: any) {
    removeImage(imageData, "banners");
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const getBannerHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const fields = req.query.fields as string;

    const banner = await getBanner(id, fields);

    res.send(banner);
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

const getBannersHandler = async (req: Request, res: Response) => {
  const fields = req.query.fields as string;

  const banners = await getBanners(fields);

  res.json(banners);
};

const updateBannerHandler = async (
  req: Request<{ id: string }, {}, UpdateBanner["body"]>,
  res: Response,
  next: NextFunction
) => {
  let imageData: Prisma.InputJsonValue | undefined;

  if (req.file) {
    imageData = await uploadImage(req.file, "banners");
  }
  try {
    const { id } = req.params;

    const updateData: Parameters<typeof updateBanner>[1] = {
      ...req.body,
      adminId: req.admin?.id,
    };

    if (imageData) {
      updateData.image_data = imageData as ImageDataType;
    }

    const banner = await updateBanner(id, updateData);
    res.json(banner);
  } catch (error: any) {
    if (imageData) {
      removeImage(imageData, "banners");
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

const deleteBannerHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteBanner(req.params.id);
    res.status(204).json({ msg: "banner deleted successfully" });
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
  createBannerHandler,
  updateBannerHandler,
  getBannerHandler,
  getBannersHandler,
  deleteBannerHandler,
};
