import prisma from "@/prisma";
import { CreateColor } from "@/types";
import { error, generateSelectFields, generateSlug } from "@/utils";

const createColor = async (data: CreateColor, id?: string) => {
  const { slug, name } = data;

  const adminConnect = id ? { connect: { id } } : undefined;

  const color = await prisma.color.create({
    data: {
      ...data,
      slug: slug || generateSlug(name),
      ...(adminConnect && { createdBy: adminConnect }),
    },
  });

  return color;
};

const deleteColor = async (id: string) => {
  // check is color exist
  const color = await prisma.color.findUnique({ where: { id } });

  if (!color) {
    throw error(404, "color not found");
  }

  // delete color
  await prisma.color.delete({ where: { id } });

  return "color deleted success fully";
};

const getColors = (limit: number, fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.color.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select,
  });
};

export { createColor, deleteColor, getColors };
