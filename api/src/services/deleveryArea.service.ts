import prisma from "@/prisma";
import { CreateDeleveryArea, UpdateDleveryArea } from "@/types";
import { error, generateSlug } from "@/utils";

const createDeleveryArea = async (data: CreateDeleveryArea) => {
  const deleveryArea = await prisma.delevery_area.create({
    data: {
      ...data,
      slug: generateSlug(data.name),
    },
  });

  return deleveryArea;
};

const updateDeleveryArea = async (id: string, data: UpdateDleveryArea) => {
  // check is delvery area exist
  const deleveryArea = await prisma.delevery_area.findUnique({
    where: { id },
  });

  if (!deleveryArea) {
    throw error(404, "delevery area not found");
  }

  // update payment method
  const updatedDeleveryArea = await prisma.delevery_area.update({
    where: { id },
    data,
  });

  return updatedDeleveryArea;
};

const deleteDeleveryArea = async (id: string) => {
  // check is delevery area exist
  const paymentMethod = await prisma.delevery_area.findUnique({
    where: { id },
  });

  if (!paymentMethod) {
    throw error(404, "delevery area not found");
  }

  // delete delevery area
  await prisma.delevery_area.delete({ where: { id } });

  return "delevery area deleted success fully";
};

const getDeleveryAreas = (limit: number) => {
  return prisma.delevery_area.findMany({
    take: limit,

    select: {
      name: true,
      charge: true,
      slug: true,
      id: true,
    },
  });
};

const getDeliveryArea = async (id: string) => {
  const area = await prisma.delevery_area.findUnique({ where: { id } });
  if (!area) throw error(404, "delivery area not found");

  return area;
};

export {
  createDeleveryArea,
  updateDeleveryArea,
  deleteDeleveryArea,
  getDeleveryAreas,
  getDeliveryArea,
};
