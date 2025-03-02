// services/order.service.ts
import prisma from "@/prisma";
import { CreateOrderInput } from "@/types";
import { error } from "@/utils";
import { Prisma, Order_status, Payment_status } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Include type for order relations
const orderSelect = {
  id: true,
  customer_id: true,
  status: true,
  createdAt: true,
  number: true,
  delivery_area: { select: { name: true, charge: true } },
  items: {
    select: {
      id: true,
      product: {
        select: {
          images: true,
          name: true,
        },
      },
      product_id: true,
      color: { select: { name: true } },
      size: { select: { name: true } },
      price: true,
      quantity: true,
    },
  },
  shipping_address: true,
  payment: { select: { method: { select: { name: true } } } },
  customer: {
    select: { name: true, number: true, address: true },
  },
};

interface CreateOrder extends CreateOrderInput {
  customer_id: string;
}

export const createOrder = async ({
  items,
  customer_id,
  shipping_address,
  number,
  payment_method_id,
  coupon_code,
  delivery_area_id,
}: CreateOrder) => {
  return await prisma.$transaction(async (tx) => {
    if (items.length < 1) {
      throw error(400, "please selecet some products");
    }
    //  Validate products and calculate total
    const productIds = items.map((item) => item.product_id);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    // Validate all products exist
    if (products.length !== items.length) {
      throw error(404, "One or more products not found");
    }

    // Calculate total and validate stock
    let total = new Prisma.Decimal(0);
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id)!;

      if (product.stock_quantity < item.quantity) {
        throw error(400, `Insufficient stock for product ${product.name}`);
      }

      total = total.plus(
        new Prisma.Decimal(product.sale_price).times(item.quantity)
      );

      return {
        product_id: product.id,
        quantity: item.quantity,
        price: product.sale_price,
        color_id: item.color_id,
        size_id: item.size_id,
        discount: product.base_price.minus(product.sale_price),
      };
    });

    //  Apply coupon if valid
    // if (couponCode) {
    //   const coupon = await tx.coupon.findUnique({
    //     where: { code: couponCode },
    //   });

    //   if (coupon && coupon.isActive) {
    //     total = total.minus(
    //       total.times(coupon.discountPercentage).dividedBy(100)
    //     );
    //   }
    // }

    //  Create order
    const order = await tx.order.create({
      data: {
        total_amount: total,
        shipping_address,
        number,

        customer: {
          connect: { id: customer_id },
        },
        items: {
          createMany: {
            data: orderItems,
          },
        },
        payment: {
          create: {
            method: { connect: { id: payment_method_id } },
            amount: total,
          },
        },
        delivery_area: {
          connect: { id: delivery_area_id },
        },
        coupon_code,
      },

      select: orderSelect,
    });

    //  Update product stock
    await Promise.all(
      items.map((item) =>
        tx.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.quantity } },
        })
      )
    );

    return order;
  });
};

export const getOrders = async (
  customer_id?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  // Search filter
  if (search) {
    where.customer = {
      name: { contains: search, mode: "insensitive" },
    };
  }

  if (customer_id) {
    where.customer_id = customer_id;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customer: { select: { name: true, id: true } },
        total_amount: true,
        createdAt: true,
        status: true,
        shipping_address: true,
        number: true,
      },
    }),
    prisma.order.count(),
  ]);

  return {
    data: orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getOrderById = async (id: string, customer_id?: string) => {
  const order = await prisma.order.findUnique({
    where: { id, deletedAt: null },
    select: orderSelect,
  });

  if (!order) throw error(404, "Order not found");
  if (customer_id && order.customer_id !== customer_id)
    throw error(403, "Unauthorized access");

  return order;
};

export const updateOrderStatus = async (id: string, status: Order_status) => {
  const order = await getOrderById(id);

  if (!isValidTransition(order.status, status)) {
    throw error(400, "Invalid status transition");
  }

  let data: { status: Order_status; payment_status?: Payment_status } = {
    status,
  };
  if (status === "DELIVERED") {
    data.payment_status = "COMPLETED";
  }

  return prisma.order.update({
    where: { id },
    data,
    select: orderSelect,
  });
};

// export const processPayment = async (
//   order_id: string,
//   paymentToken: string,
//   amount: Decimal
// ) => {
//   return prisma.$transaction(async (tx) => {
//     const order = await tx.order.findUnique({
//       where: { id: order_id },
//       include: { payment: true },
//     });

//     if (!order) throw new Error("Order not found");
//     if (order.payment_status === "COMPLETED") {
//       throw new Error("Payment already completed");
//     }

//     // Mock payment processing - replace with real payment gateway integration
//     const paymentResult = await mockPaymentProcessor(
//       paymentToken,
//       amount,
//       order.payment?.method || "credit_card"
//     );

//     const payment = await tx.payment.update({
//       where: { order_id },
//       data: {
//         status: paymentResult.success ? "COMPLETED" : "FAILED",
//         transaction_id: paymentResult.transactionId,
//       },
//     });

//     await tx.order.update({
//       where: { id: orderId },
//       data: {
//         paymentStatus: payment.status === "COMPLETED" ? "COMPLETED" : "FAILED",
//       },
//     });

//     return payment;
//   });
// };

export const cancelOrder = async (id: string, customer_id: string) => {
  return prisma.$transaction(async (tx) => {
    const order = await getOrderById(id, customer_id);

    if (order.status !== "PENDING") {
      throw error(400, "Cannot cancel order in current status");
    }

    const updatedOrder = await tx.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    // Restore product stock
    await Promise.all(
      order.items.map((item) =>
        tx.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { increment: item.quantity } },
        })
      )
    );

    return updatedOrder;
  });
};

// Helper functions
const isValidTransition = (from: Order_status, to: Order_status) => {
  const validTransitions: Record<Order_status, Order_status[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: ["RETURNED"],
    CANCELLED: [],
    RETURNED: [],
  };
  return validTransitions[from].includes(to);
};

const mockPaymentProcessor = async (
  token: string,
  amount: Decimal,
  method: string
) => {
  // Replace with real payment gateway integration
  return {
    success: true,
    transactionId: `tx_${Date.now()}`,
  };
};
