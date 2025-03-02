import { NextFunction, Request, Response } from "express";
import { createRole, updateRole } from "../services/role.service";
import {
  AdminLogin,
  AdminRegistration,
  ChangeAdminStatus,
  CreateRoleInput,
  ResetPassword,
  UpdateAdminRole,
  UpdateRoleInput,
} from "@/types";
import { z } from "zod";
import { createRoleSchema } from "@/schemas";
import {
  adminLogin,
  adminRegistration,
  changeAdminStatus,
  getAdmin,
  resetPassword,
  updateAdminRole,
} from "@/services/auth.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config";

const createRoleHandler = async (
  req: Request<{}, {}, CreateRoleInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // create role
    const role = await createRole(req.body);
    res.status(201).json(role);
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

const updateRoleHandler = async (
  req: Request<{ id: string }, {}, UpdateRoleInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await updateRole(req.params.id, req.body);
    res.json(role);
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

const adminRegistrationHandler = async (
  req: Request<{}, {}, AdminRegistration>,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = await adminRegistration(req.body);

    res.json({ accessToken });
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

const adminLoginHandler = async (
  req: Request<{}, {}, AdminLogin>,
  res: Response,
  next: NextFunction
) => {
  try {
    // collect user info
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const user_agent = req.headers["user-agent"] || "";

    const accessToken = await adminLogin({
      ...req.body,
      ip: ipAddress,
      user_agent,
    });

    res.json({ accessToken });
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

const updateAdminRoleHandler = async (
  req: Request<{ id: string }, {}, UpdateAdminRole>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await updateAdminRole(id, req.body.role_id);

    res.json({ msg: "role updated success fully" });
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

const changeAdminStatusHandler = async (
  req: Request<{ id: string }, {}, ChangeAdminStatus>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await changeAdminStatus(id, req.body.status);

    res.json({ msg: "role updated success fully" });
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

const resetPasswordHandler = async (
  req: Request<{ id: string }, {}, ResetPassword>,
  res: Response,
  next: NextFunction
) => {
  try {
    // check who is requested for reset
    const { id } = req.params;
    if (id !== req.admin?.id) {
      res.status(403).json({ msg: "Forbidden" });
    }

    const { oldPassword, newPassword } = req.body;
    const accessToken = await resetPassword(id, oldPassword, newPassword);

    res.json({ accessToken });
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

const getAdminHandler = async (
  req: Request<{ id: string }, {}, ResetPassword>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ msg: "no access token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };

    const admin = await getAdmin(decoded.id);

    res.send(admin);
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

export {
  createRoleHandler,
  updateRoleHandler,
  adminRegistrationHandler,
  adminLoginHandler,
  updateAdminRoleHandler,
  changeAdminStatusHandler,
  resetPasswordHandler,
  getAdminHandler,
};
