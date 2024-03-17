import jwt from "jsonwebtoken";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";

import { Password } from "../services/password";
import { BadRequestError, validateRequest } from "@ticketing-nir/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [body("email").isEmail().withMessage("Email must be valid"), body("password").trim().notEmpty().withMessage("You must provide a password")],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return next(new BadRequestError("Invalid Email or Password"));
      }
      const passwordsMatch = await Password.compare(existingUser.password, password);
      if (!passwordsMatch) {
        return next(new BadRequestError("Invalid Email or Password"));
      }
      const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);
      req.session = { jwt: userJwt };
      res.status(200).send(existingUser);
    } catch (err) {
      res.status(200).send(err);
    }
  }
);

export { router as signinRouter };
