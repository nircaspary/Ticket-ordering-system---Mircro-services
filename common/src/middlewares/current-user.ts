import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";

interface userPayload {
  id: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next(new NotAuthorizedError());
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as userPayload;
    req.currentUser = payload;
  } catch (err) {
    return next(err);
  }
  next();
};
