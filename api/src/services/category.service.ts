import prisma from "@/prisma";
import {
  error,
  generateSelectFields,
  generateSlug,
  removeImage,
} from "@/utils";
import { Prisma, Status } from "@prisma/client";
import { Category } from "@prisma/client";

const createCategory = async (input: {
  name: string;
  slug?: string;
  parent_id?: string | null;
  description?: string;
  image_data: Prisma.InputJsonValue;
  is_active?: boolean;
  admin_id?: string;
}) => {
  if (input.parent_id) {
    const parentExists = await prisma.category.findUnique({
      where: { id: input.parent_id },
    });
    if (!parentExists) {
      throw error(404, "parent category not found");
    }
  }

  if (!input.slug) {
    input.slug = generateSlug(input.name);
  }

  return prisma.category.create({
    data: {
      ...input,
      slug: input.slug,
      parent_id: input.parent_id || null,
      admin_id: input.admin_id,
    },
  });
};

const getCategory = async (id: string, fields?: string) => {
  const select = fields ? generateSelectFields(fields) : undefined;

  return prisma.category.findUnique({ where: { id }, select });
};

interface categoryQueryParams {
  page: number;
  limit: number;
  skip: number;
  fields?: object;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  status: Status;
  where?: object;
  productCount?: boolean;
}

const getCategories = async (
  params: categoryQueryParams,
  includeChildren: boolean = true
) => {
  const where: Prisma.CategoryWhereInput = { ...params.where, deletedAt: null };
  let orderBy: Prisma.CategoryOrderByWithRelationInput = {};

  // Search filter
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  // status
  if (params.status) {
    where.status = params.status;
  }

  // Sorting
  orderBy.createdAt = "desc";
  if (params.sortBy && params.sortOrder) {
    orderBy = {};
    orderBy[params.sortBy] = params.sortOrder;
  }

  if (params.sortBy === "productCount") {
    orderBy = {};
    orderBy.products = { _count: params.sortOrder };
    params.fields = {
      ...params.fields,
      products: {
        take: 12,
        select: {
          id: true,
          name: true,
          images: true,
          slug: true,
          base_price: true,
          sale_price: true,
          reviews_count: true,
          rating: true,
          categories: { select: { id: true, name: true } },
        },
      },
    };
  }

  if (params.productCount) {
    params.fields = {
      ...params.fields,
      _count: {
        select: { products: true },
      },
    };
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      select: {
        children: includeChildren ? { where: { deletedAt: null } } : false,
        ...params.fields,
      },
      skip: params.skip,
      take: params.limit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data: categories,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
};

const getCategoryTree = async () => {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
  });
  const buildTree = (parentId: string | null): Category[] => {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => ({
        ...cat,
        children: buildTree(cat.id),
      }));
  };

  return buildTree(null);
};

const updateCategory = async (
  id: string,
  input: {
    name?: string;
    slug?: string;
    parent_id?: string | null;
    description?: string;
    image_data?: Prisma.InputJsonValue;
    is_active?: boolean;
  }
) => {
  // check if category exist
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw error(404, "category not found");

  // remove old image
  if (input.image_data) {
    removeImage(category.image_data as Prisma.InputJsonValue, "categories");
  }

  if (input.parent_id === id) {
    throw error(400, "Cannot be parent of itself");
  }

  if (input.parent_id) {
    const parentExists = await prisma.category.findUnique({
      where: { id: input.parent_id },
    });
    if (!parentExists) {
      throw error(404, "Parent category not found");
    }
  }

  return prisma.category.update({
    where: { id },
    data: input,
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryTree,
};
