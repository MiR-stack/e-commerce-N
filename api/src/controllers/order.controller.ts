import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../services/order.service";

import { z } from "zod";
import { CreateOrderInput } from "@/types";

export const createOrderHandler = async (
  req: Request<{}, {}, CreateOrderInput>,
  res: Response,
  next: NextFunction
) => {
  const customer_id = req.customer?.id!;

  try {
    const order = await createOrder({
      customer_id,
      ...req.body,
    });

    res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

export const getOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const custome_id = req.customer?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    // Admin can see all orders
    const isAdmin = req.is_admin;
    const orders = await getOrders(
      isAdmin ? undefined : custome_id,
      page,
      limit,
      search
    );

    res.json(orders);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

export const getOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer_id = req.customer?.id;
    const isAdmin = req.is_admin;

    const order = await getOrderById(
      req.params.id,
      isAdmin ? undefined : customer_id
    );
    res.json(order);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

export const updateOrderStatusHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

// export const processPaymentHandler = async (
//   req: Request<{ id: string }, {}, ProcessPaymentInput>,
//   res: Response
// ) => {
//   try {
//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ msg: "Validation error", errors: error.errors });
//       return;
//     }
//     next(error);
//   }
//   const userId = res.locals.user.id;
//   const order = await getOrderById(req.params.id, userId);

//   const payment = await processPayment(
//     req.params.id,
//     req.body.paymentToken,
//     order.totalAmount
//   );

//   res.json(payment);
// };

export const cancelOrderHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.customer?.id!;
    const order = await cancelOrder(req.params.id, userId);
    res.json(order);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ msg: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};
