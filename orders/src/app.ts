import cookieSession from "cookie-session";
import express, { NextFunction, Request, Response } from "express";

import { NotFoundError, currentUser, errorHandler } from "@ticketing-nir/common";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));

app.use(currentUser);
app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});
app.use(errorHandler);

export { app };
