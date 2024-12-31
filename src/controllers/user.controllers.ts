import { Request, Response } from "express";
import { User } from "../models/user.models";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req.session as any).user.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
