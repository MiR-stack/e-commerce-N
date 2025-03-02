import { SESSION_TTL } from "@/config";
import redis from "@/redis";
import { AddToCart } from "@/types";
import { v4 as uuid } from "uuid";

const addToCart = async (sessionId: string | null, data: AddToCart) => {
  const { productId, quantity, color_id, size_id } = data;

  if (sessionId) {
    // check is session id expired
    const exist = await redis.get(`sessionId:${sessionId}`);
    if (!exist) {
      sessionId = null;
    }

    await redis.expire(`sessionId:${sessionId}`, SESSION_TTL);
  }

  if (!sessionId) {
    sessionId = uuid();

    await redis.setex(`sessionId:${sessionId}`, SESSION_TTL, sessionId);
  }

  // add item to the cart
  await redis.hset(
    `cart:${sessionId}`,
    productId,
    JSON.stringify({
      productId,
      quantity,
      color_id,
      size_id,
    })
  );

  return sessionId;
};

const clearCart = async (sessionId: string) => {
  if (!sessionId) {
    return { status: 404, msg: "cart not found" };
  }

  // check if session id exist
  const exist = await redis.get(`sessionId:${sessionId}`);
  if (!exist) {
    return { status: 200, msg: "cart cleared" };
  }

  // check if cart exist
  const cart = await redis.hgetall(`cart:${sessionId}`);
  if (!cart) return { status: 200, msg: "cart cleared" };

  // clear cart
  await redis.del(`sessionId:${sessionId}`);
  await redis.del(`cart:${sessionId}`);

  return { status: 200, msg: "cart cleared" };
};

const myCart = async (sessionId: string) => {
  // check is session id expired
  const exist = await redis.get(`sessionId:${sessionId}`);

  if (!exist) {
    // check if cart exist
    const cart = await redis.hgetall(`cart:${sessionId}`);
    if (cart) {
      await redis.del(`cart:${sessionId}`);
    }
    return [];
  }

  // get cart items
  const cart = await redis.hgetall(`cart:${sessionId}`);

  const formatedItems = Object.keys(cart).map((key) => {
    const item = JSON.parse(cart[key]) as {
      quantity: number;
      color_id?: string;
      size_id?: string;
    };

    return {
      product_id: key,
      quantity: item.quantity,
      color_id: item.color_id,
      size_id: item.size_id,
    };
  });

  return formatedItems;
};

export { addToCart, clearCart, myCart };
