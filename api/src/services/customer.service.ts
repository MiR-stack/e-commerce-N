import prisma from "@/prisma";
import { CreateCustomer, UpdateCustomer } from "@/types";
import { error, generateSelectFields } from "@/utils";
import { Customer, Order, Prisma } from "@prisma/client";

const createCustomer = async (ip: string, data: CreateCustomer) => {
  // check is customer already exist
  const isExist = await prisma.customer.findUnique({ where: { ip } });

  if (isExist) {
    return isExist;
  }

  const customer = await prisma.customer.create({
    data: {
      ...data,
      ip,
    },
  });

  return customer;
};

const updateCustomer = async (id: string, data: UpdateCustomer) => {
  // check is customer exist
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw error(404, "customer not found");
  }

  // update customer
  const updatedCustomer = await prisma.customer.update({
    where: { id },
    data,
  });

  return updatedCustomer;
};

const toggleBlockCustomer = async (id: string) => {
  // check is customer exist
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw error(404, "customer not found");
  }

  // delete customer
  await prisma.customer.update({
    where: { id },
    data: {
      is_blocked: !customer.is_blocked,
    },
  });

  return `customer ${
    customer.is_blocked ? "unblocked" : "blocked"
  } successfully`;
};

const getCustomers = async ({
  fields,
  page,
  limit,
  search,
}: {
  fields?: string;
  page: number;
  limit: number;
  search?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const select = fields ? generateSelectFields(fields) : undefined;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        ...select,
        orders: {
          select: { total_amount: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    data: customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCustomer = async (ip: string) => {
  const customer = await prisma.customer.findUnique({
    where: { ip },
  });

  if (!customer) {
    throw error(404, "Customer not found");
  }

  return customer;
};

export interface CustomerStats {
  lifetimeSpent: number;
  averageOrder: number;
  orderCount: number;
}

/**
 * Get a single customer by ID.
 * Optionally include orders if needed (e.g. recent orders).
 */
const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  return prisma.customer.findUnique({
    where: { id: customerId },
  });
};

/**
 * Get aggregated stats for a given customer:
 *  - lifetimeSpent (sum of all orders)
 *  - averageOrder (average total_amount)
 *  - orderCount (number of orders)
 */
const getCustomerStats = async (customerId: string): Promise<CustomerStats> => {
  const aggResult = await prisma.order.aggregate({
    where: { customer_id: customerId },
    _count: { id: true },
    _sum: { total_amount: true },
    _avg: { total_amount: true },
  });

  return {
    lifetimeSpent: Number(aggResult._sum.total_amount ?? 0),
    averageOrder: Number(aggResult._avg.total_amount ?? 0),
    orderCount: aggResult._count.id,
  };
};

/**
 * Fetch recent orders for a given customer, sorted by createdAt descending.
 * Adjust `take` to however many recent orders you want.
 */
const getRecentOrders = async (
  customerId: string,
  limit = 5
): Promise<Order[]> => {
  return prisma.order.findMany({
    where: { customer_id: customerId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

/**
 * Block a customer (is_blocked = true).
 */
const blockCustomer = async (customerId: string): Promise<Customer> => {
  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: { is_blocked: true },
  });
  return updatedCustomer;
};

/**
 * Unblock a customer (is_blocked = false).
 */
const unblockCustomer = async (customerId: string): Promise<Customer> => {
  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: { is_blocked: false },
  });
  return updatedCustomer;
};

export {
  createCustomer,
  updateCustomer,
  toggleBlockCustomer,
  getCustomers,
  getCustomer,
  getCustomerById,
  getCustomerStats,
  getRecentOrders,
  blockCustomer,
  unblockCustomer,
};
