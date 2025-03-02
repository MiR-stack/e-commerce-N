import { emailSchema } from "@/schemas";
import sendEmail from "@/services/email.service";
import { Request, Response, NextFunction, RequestHandler } from "express";

const sendMail: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate the request body
    const parsedBody = emailSchema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({ msg: parsedBody.error.errors });
      return;
    }

    // send mail
    const mail = await sendEmail(parsedBody.data);

    res.status(mail.status).json({ msg: mail.msg });
  } catch (err) {
    next(err);
  }
};

export default sendMail;
