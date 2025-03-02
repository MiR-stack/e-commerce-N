import prisma from "@/prisma";
import { CreateSize } from "@/types";
import { error, generateSelectFields, generateSlug } from "@/utils";

const createSize = async (data: CreateSize, id?: string) => {
  const slug = generateSlug(data.name);

  const adminConnect = id ? { connect: { id } } : undefined;
  const size = await prisma.sizes.create({
    data: {
      ...data,
      slug,
      ...(adminConnect && { createdBy: adminConnect }),
    },
  });

  return size;
};

const deleteSize = async (id: string) => {
  // check is size exist
  const size = await prisma.sizes.findUnique({ where: { id } });

  if (!size) {
    throw error(404, "size not found");
  }

  // delete size
  await prisma.sizes.delete({ where: { id } });

  return "size deleted success fully";
};

const getSizes = (fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.sizes.findMany({
    orderBy: {
      order: "asc",
    },
    select: {
      name: true,
      slug: true,
      id: true,
      order: true,
    },
  });
};

export { createSize, deleteSize, getSizes };
