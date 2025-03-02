import prisma from "@/prisma";
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ValidPermissions } from "@/types";
import { JWT_SECRET } from "@/config";
import { error } from "@/utils";

declare module "express" {
  interface Request {
    admin?: {
      id: string;
      role: {
        permissions: string[];
      };
    };
    is_admin?: boolean;
    customer?: { id: string; ip: string };
  }
}

const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw error(400, "No token provided");

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!admin) throw error(404, "admin not found");

    req.admin = {
      id: admin.id,
      role: {
        permissions: admin.role.permissions.map((p) => p.name),
      },
    };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

const hasPermission = (
  requiredPermission: ValidPermissions
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin?.role.permissions.includes(requiredPermission)) {
      res.status(403).json({ msg: "Forbidden" });
      return;
    }
    next();
  };
};

const isAdmin = (requiredPermission: ValidPermissions) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        req.is_admin = false;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET!) as {
        id: string;
      };

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!admin) {
        req.is_admin = false;
        return next();
      }
      const hasPermission = admin.role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      req.is_admin = hasPermission;

      return next();
    } catch (error) {
      req.is_admin = false;
      return next();
    }
  };
};

const currentUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // If user is admin, allow access immediately
    if (req.is_admin) {
      return next();
    }

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

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { ip },
      select: { id: true }, // Only select what we need
    });

    if (!customer) {
      res.status(401).json({
        success: false,
        msg: "Customer not found",
      });
      return;
    }

    req.customer = { id: customer.id, ip };
    return next();
  } catch (error) {
    console.error("currentUser middleware error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
    return;
  }
};

export { authenticateAdmin, hasPermission, isAdmin, currentUser };
