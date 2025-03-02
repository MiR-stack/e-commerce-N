import { addToCartSchema } from "@/schemas";
import { addToCart, clearCart, myCart } from "@/services/cart.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const addToCarthandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const parsedBody = addToCartSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ errors: parsedBody.error.errors });
      return;
    }

    // get session id
    const sessionId = (req.headers["x-session-id"] as string) || null;

    const cartSession = await addToCart(sessionId, parsedBody.data);

    res.json({ sessionId: cartSession });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const clearCartHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get session id
    const sessionId = (req.headers["x-session-id"] as string) || null;
    if (!sessionId) {
      res.status(404).json({ msg: "cart not found" });
      return;
    }

    // clear cart
    const { status, msg } = await clearCart(sessionId);
    res.status(status).json({ msg });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

const myCartHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get session id
    const sessionId = (req.headers["x-session-id"] as string) || null;
    if (!sessionId) {
      res.send({ data: [] });
      return;
    }

    const cart = await myCart(sessionId);

    res.send({ data: cart });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    next(error);
  }
};

export { addToCarthandler, clearCartHandler, myCartHandler };
