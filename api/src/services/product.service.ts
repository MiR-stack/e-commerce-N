import prisma from "@/prisma";
import { generateSelectFields } from "@/utils";
import { Prisma } from "@prisma/client";

interface ProductQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  quantity?: string;
  fields?: string;
  featured?: boolean;
  special?: boolean;
  category?: string;
  color?: string;
  size?: string;
}

export const getFilteredProducts = async (params: ProductQueryParams) => {
  const where: Prisma.ProductWhereInput = {};
  let orderBy: Prisma.ProductOrderByWithRelationInput = {};

  // pagination
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;

  // Search filter
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }
  // featured product filter
  if (params.featured) {
    where.is_featured = true;
  }
  // special product filter
  if (params.special) {
    where.is_special = true;
  }
  // category product filter
  if (params.category) {
    where.categories = { some: { slug: params.category } };
  }
  // color product filter
  if (params.color) {
    where.colors = { some: { slug: params.color } };
  }
  // size product filter
  if (params.size) {
    where.sizes = { some: { slug: params.size } };
  }
  // Price range filter
  if (params.minPrice || params.maxPrice) {
    where.sale_price = {
      gte: params.minPrice,
      lte: params.maxPrice,
    };
  }

  console.log(params.size, params.color);

  // Status filter
  if (params.status) {
    where.status = params.status === "active" ? "PUBLISED" : "DRAFT";
  }

  // Quantity filter
  if (params.quantity) {
    switch (params.quantity) {
      case "inStock":
        where.stock_quantity = { gt: 10 };
        break;
      case "lowStock":
        where.stock_quantity = { lte: 10, gt: 0 };
        break;
      case "outOfStock":
        where.stock_quantity = { lte: 0 };
        break;
    }
  }

  // Sorting
  orderBy.createdAt = "desc";
  if (params.sortBy && params.sortOrder) {
    orderBy = {};
    orderBy[params.sortBy] = params.sortOrder;
  }

  if (params.sortBy === "topRated") {
    orderBy = {
      rating: "desc",
    };
  }
  if (params.sortBy === "popular") {
    orderBy = {
      order_items: { _count: "desc" },
    };
  }

  // selecting fields
  const fields = params.fields
    ? generateSelectFields(params.fields)
    : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: Object.keys(fields || {}).length > 0 ? fields : undefined,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRelatedProducts = async (
  productId: string,
  limit: number = 4
) => {
  // Get current product with its categories
  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
    },
  });

  if (!currentProduct) {
    throw new Error("Product not found");
  }

  // Get IDs of current product's categories
  const categoryIds = currentProduct.categories.map((category) => category.id);

  let whereClause = {};

  if (categoryIds.length > 0) {
    whereClause = {
      AND: [
        { id: { not: productId } }, // Exclude current product
        { categories: { some: { id: { in: categoryIds } } } }, // Shared categories
        { status: "PUBLISED" }, // Only published products
      ],
    };
  } else {
    // Fallback if product has no categories
    whereClause = {
      AND: [
        { id: { not: productId } },
        { status: "PUBLISED" },
        { OR: [{ is_featured: true }, { is_special: true }] },
      ],
    };
  }

  const select = generateSelectFields(
    "name,id,base_price,sale_price,images,reviews_count"
  );

  return prisma.product.findMany({
    where: whereClause,
    orderBy: [
      { rating: "desc" }, // Highest rated first
      { reviews_count: "desc" }, // Then most reviewed
      { createdAt: "desc" }, // Then newest
    ],
    take: limit,
    select,
  });
};
