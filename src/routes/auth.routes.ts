import express from "express";
import {
  signupUser,
  signinUser,
  signoutUser,
} from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post("/signup", signupUser);

authRouter.post("/signin", signinUser);

authRouter.get("/signout", signoutUser);
