import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.models";
import { isSessionActive } from "../utils/validators";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isSessionActive(req)) {
      throw new Error("Something went wrong. Please login again.");
    }
    next();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
