import express from "express";
import { signupUser, signinUser } from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post("/signup", signupUser);

authRouter.post("/signin", signinUser);
