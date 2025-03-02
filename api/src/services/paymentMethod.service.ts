import prisma from "@/prisma";
import { ImageDataType } from "@/types";
import { error, generateSelectFields, removeImage } from "@/utils";
import { Prisma } from "@prisma/client";

const createPaymentMethod = async (input: {
  name: string;
  number: string;
  description?: string;
  image_data: ImageDataType;
}) => {
  const { name, number, description, image_data } = input;
  return prisma.payment_method.create({
    data: {
      name,
      number,
      description,
      image_data,
    },
  });
};

const getPaymentMethod = async (id: string, fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.payment_method.findUnique({ where: { id }, select });
};

const getPaymentMethods = async (fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;
  return prisma.payment_method.findMany({
    select,
    orderBy: { createdAt: "desc" },
  });
};

const updatePaymentMethod = async (
  id: string,
  input: {
    name?: string;
    number?: string;
    description?: string;
    image_data?: ImageDataType;
  }
) => {
  // check if payment method exist
  const method = await prisma.payment_method.findUnique({ where: { id } });
  if (!method) throw error(404, "payment method not found");

  // remove old image
  if (input.image_data) {
    removeImage(method.image_data as Prisma.InputJsonValue, "paymentMethods");
  }

  return prisma.payment_method.update({
    where: { id },
    data: input,
  });
};

const deltePaymentMethod = async (id: string) => {
  return prisma.payment_method.delete({
    where: { id },
  });
};

export {
  createPaymentMethod,
  updatePaymentMethod,
  getPaymentMethod,
  getPaymentMethods,
  deltePaymentMethod,
};
