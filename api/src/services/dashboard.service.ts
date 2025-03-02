import prisma from "@/prisma";

const getStartEndOfDay = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

export const getDashboardStats = async () => {
  const { startOfDay, endOfDay } = getStartEndOfDay();

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    totalCanceled,
    totalCompleted,
    todaysActivity,
  ] = await Promise.all([
    // Total Revenue (only completed orders)
    prisma.order.aggregate({
      _sum: { total_amount: true },
      where: { payment_status: "COMPLETED" },
    }),

    // Total Orders
    prisma.order.count(),

    // Total Customers
    prisma.customer.count(),

    // Total Products
    prisma.product.count(),

    // Total Canceled Orders
    prisma.order.count({ where: { status: "CANCELLED" } }),

    // Total Completed Orders
    prisma.order.count({
      where: {
        status: "DELIVERED",
        payment_status: "COMPLETED",
      },
    }),

    // Today's Activity
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: {
        updatedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
  ]);

  return {
    totals: {
      revenue: totalRevenue._sum.total_amount || 0,
      orders: totalOrders,
      customers: totalCustomers,
      products: totalProducts,
      canceled: totalCanceled,
      completed: totalCompleted,
    },
    todaysActivity: todaysActivity.map((activity) => ({
      status: activity.status,
      count: activity._count._all,
    })),
  };
};
