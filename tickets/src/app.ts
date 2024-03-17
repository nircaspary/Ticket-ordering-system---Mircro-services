import { NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
import express from "express";

import { NotFoundError, errorHandler, currentUser } from "@ticketing-nir/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));

app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(currentUser);
app.use(updateTicketRouter);
app.use(createTicketRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});
app.use(errorHandler);

export { app };
