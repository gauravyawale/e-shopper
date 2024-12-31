import express from "express";
import {
  signupUser,
  signinUser,
  signoutUser,
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  resetPassword,
} from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post("/signup", signupUser);

authRouter.post("/signin", signinUser);

authRouter.get("/signout", signoutUser);

authRouter.post("/reset-password-otp", sendResetPasswordOTP);

authRouter.post("/verify-reset-password-otp", verifyResetPasswordOTP);

authRouter.post("/reset-password", resetPassword);
