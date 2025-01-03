import { Request, Response } from "express";
import { User } from "../models/user.models";
import {
  USER_ALLOWED_FIELDS,
  USER_READ_FIELDS,
} from "../utils/constants.utils";

export const getUser = async (req: Request, res: Response) => {
  let user: any = {};
  Object.keys(req.body.user.toObject()).forEach((key) => {
    if (USER_READ_FIELDS.includes(key)) {
      user[key] = req.body.user[key];
    }
  });
  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    Object.keys(req.body.updateUser).every((key) => {
      if (!USER_ALLOWED_FIELDS.includes(key)) {
        throw new Error(`Field ${key} is not allowed to update`);
      }
    });
    Object.keys(req.body.updateUser).forEach((key) => {
      user[key] = req.body.updateUser[key];
    });
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.body.user._id);
    (req.session as any).user = null;
    req.session.cookie = null;
    req.session.destroy(() => {
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
