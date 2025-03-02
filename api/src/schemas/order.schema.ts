import { Order_status } from "@prisma/client";
import { z } from "zod";

const orderItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().positive(),
  color_id: z.string().optional(),
  size_id: z.string().optional(),
});

export const createOrderSchema = z.object({
  shipping_address: z.string(),
  number: z.string(),
  payment_method_id: z.string(),
  coupon_code: z.string().optional(),
  delivery_area_id: z.string(),
  items: z.array(orderItemSchema),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(Order_status),
});

export const processPaymentSchema = z.object({
  payment_token: z.string().min(1),
  amount: z.number().positive(),
});

export type CreateOrderInput = z.TypeOf<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.TypeOf<typeof updateOrderStatusSchema>;
export type ProcessPaymentInput = z.TypeOf<typeof processPaymentSchema>;
export type OrderItem = z.TypeOf<typeof orderItemSchema>;
