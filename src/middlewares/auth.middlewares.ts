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
      res.status(403).json({ message: "Session expired. Please login again!" });
      return;
    }
    const user = await User.findById((req.session as any).user.userId);
    req.body.user = user;
    next();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
