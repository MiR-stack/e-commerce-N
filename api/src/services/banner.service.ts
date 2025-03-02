import prisma from "@/prisma";
import { ImageDataType } from "@/types";
import { error, generateSelectFields, removeImage } from "@/utils";
import { Prisma } from "@prisma/client";

const createBanner = async (input: {
  title: string;
  sub_title: string;
  image_data: ImageDataType;
  adminId: string;
}) => {
  const { title, sub_title, image_data, adminId } = input;
  return prisma.banner.create({
    data: {
      title,
      sub_title,
      image_data,
      adminId,
    },
  });
};

const getBanner = async (id: string, fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.banner.findUnique({ where: { id }, select });
};

const getBanners = async (fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.banner.findMany({ select, orderBy: { createdAt: "desc" } });
};

const updateBanner = async (
  id: string,
  input: {
    title?: string;
    sub_title?: string;
    image_data?: ImageDataType;
    adminId?: string;
  }
) => {
  // check if banner exist
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw error(404, "banner not found");

  // remove old image
  if (input.image_data) {
    removeImage(banner.image_data as Prisma.InputJsonValue, "banner");
  }

  return prisma.banner.update({
    where: { id },
    data: input,
  });
};

const deleteBanner = async (id: string) => {
  return prisma.banner.delete({
    where: { id },
  });
};

export { createBanner, updateBanner, getBanner, getBanners, deleteBanner };
