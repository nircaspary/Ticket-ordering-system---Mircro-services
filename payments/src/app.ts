import { NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
import express from "express";

import { NotFoundError, errorHandler, currentUser } from "@ticketing-nir/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));

app.use(currentUser);
app.use(createChargeRouter);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});
app.use(errorHandler);

export { app };
