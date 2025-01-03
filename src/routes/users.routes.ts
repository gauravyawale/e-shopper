import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers";
import { userAuth } from "../middlewares/auth.middlewares";

export const userRouter = express.Router();

userRouter.get("/user", userAuth, getUser);

userRouter.post("/user", userAuth, updateUser);

userRouter.delete("/user", userAuth, deleteUser);
