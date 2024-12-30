import express from "express";
import { signupUser } from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post("/signup", signupUser);
