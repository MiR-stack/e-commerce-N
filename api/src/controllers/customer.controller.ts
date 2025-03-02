import { createCustomerSchema, updateCustomerSchema } from "@/schemas";
import {
  toggleBlockCustomer,
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  getCustomerStats,
  getRecentOrders,
  blockCustomer,
  unblockCustomer,
  getCustomerById,
} from "@/services/customer.service";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";

const createCustomerHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate request body
    const parsedBody = await createCustomerSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.send(parsedBody.error.errors);
      return;
    }
    const ip =
      (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;

    if (!ip) {
      res.status(400).json({ msg: "ip not found" });
      return;
    }

    // create customer
    const customer = await createCustomer(ip, parsedBody.data);

    res.send(customer);
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

const updateCustomerHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const isAdmin = req.is_admin;
    const customer_id = req.customer?.id;

    if (!isAdmin && !customer_id) {
      res.status(403).json({ msg: "Forbidden" });
      return;
    }

    if (!isAdmin && id !== customer_id) {
      res.status(403).json({ msg: "Forbidden" });
      return;
    }

    // update customer
    const customer = await updateCustomer(id, req.body);

    res.send(customer);
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

const blockCustomerHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // block or unblock customer
    const msg = await toggleBlockCustomer(id);

    res.send(msg);
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

const getCustomersHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const fields = req.query.fields as string | undefined;
    const customers = await getCustomers({ fields, page, limit, search });

    res.send(customers);
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

const getCustomerHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get IP address with proper type handling
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress;

    if (!ip) {
      res.status(401).json({
        success: false,
        msg: "Could not determine client IP",
      });
      return;
    }
    const customer = await getCustomer(ip);

    res.send(customer);
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

/**
 * GET /customers/:id
 * Returns a single customer with optional orders.
 */
const getCustomerByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);

    if (!customer) {
      res.status(404).json({ msg: "Customer not found" });
      return;
    }

    res.json(customer);
  } catch (error: any) {
    console.error("Error in getCustomer:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * GET /customers/:id/stats
 * Returns aggregated stats: lifetimeSpent, averageOrder, orderCount
 */
const getCustomerStatsHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await getCustomerStats(id);
    res.json(stats);
  } catch (error: any) {
    console.error("Error in getCustomerStats:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * GET /customers/:id/recent-orders
 * Returns recent orders for the given customer
 */
const getRecentOrdersHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const orders = await getRecentOrders(id, limit);
    res.json(orders);
  } catch (error: any) {
    console.error("Error in getRecentOrders:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * POST /customers/:id/block
 * Blocks the specified customer (is_blocked = true)
 */
const blocksCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await blockCustomer(id);
    res.json(updated);
  } catch (error: any) {
    console.error("Error in blockCustomer:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * POST /customers/:id/unblock
 * Unblocks the specified customer (is_blocked = false)
 */
const unblockCustomerHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await unblockCustomer(id);
    res.json(updated);
  } catch (error: any) {
    console.error("Error in unblockCustomer:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export {
  createCustomerHandler,
  updateCustomerHandler,
  blockCustomerHandler,
  getCustomersHandler,
  getCustomerHandler,
  getCustomerByIdHandler,
  getCustomerStatsHandler,
  getRecentOrdersHandler,
  blocksCustomerHandler,
  unblockCustomerHandler,
};
