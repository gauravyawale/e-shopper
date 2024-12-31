import express from "express";
import { getUser } from "../controllers/user.controllers";
import { userAuth } from "../middlewares/auth.middlewares";

export const userRouter = express.Router();

userRouter.get("/user", userAuth, getUser);
