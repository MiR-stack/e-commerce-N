import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = await schema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ msg: parsedBody.error.errors });
      return;
    }
    next();
  };
};

export default validateRequest;
