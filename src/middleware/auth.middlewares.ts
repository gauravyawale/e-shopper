import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.get("token");

    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedToken: any = await jwt.verify(
      token,
      process.env.SECRET_KEY as any
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error("Please login again");
    }
    req.user = user;
    next();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
