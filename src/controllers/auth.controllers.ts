import { Request, Response } from "express";
import { User } from "../models/user.models";
import { isSessionActive } from "../utils/validators";
import { getRandom6DigitOTP } from "../utils/helpers";
import { sendEmail } from "../config/email.config";
import nodemailer from "nodemailer";
import validator from "validator";

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, gender, dob } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await User.encryptPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      gender,
    });
    await newUser.save();
    (req.session as any).user = { userId: newUser._id as string };
    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const signinUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (isSessionActive(req)) {
      throw new Error("Already Logged in!");
    }
    const { email, password } = req.body;
    const getUser = await User.findOne({ email: email });
    if (!getUser) {
      throw new Error("Invalid Credentials!");
    }
    const isValidPassword = await getUser.decryptPassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials!");
    }

    (req.session as any).user = { userId: getUser._id as string };
    res.status(200).json({ message: "LoggedIn successfully!" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const signoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isSessionActive(req)) {
      res.status(400).json({ message: "Already Logged out" });
      return;
    }
    req.session.cookie = null;
    (req.session as any).user = null;
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (err: any) {
    res.status(500).json({ message: "Error loging out. Please try again!" });
  }
};

export const sendResetPasswordOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (isSessionActive(req)) {
      res.status(400).json({ message: "Already Logged in!" });
      return;
    }
    const { email } = req.body;
    if (validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email address!" });
      return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .json({ message: "You are not registered. Please signup!" });
      return;
    }
    const otp = getRandom6DigitOTP();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      // debug: true,
      // logger: true,
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailInfo = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Here is your OTP: ${otp}`,
    };
    transporter.sendMail(mailInfo, (err, info) => {
      if (err) {
        throw new Error("Error sending email!");
      } else {
        (req.session as any).resetDetails = { otp: otp.toString(), email };
        req.session.cookie.maxAge = 5 * 60 * 1000; // 5 minutes expiry
        res.status(200).json({ message: `Please check ${email} for OTP` });
      }
    });
    // sendEmail({
    //   to: email,
    //   subject: "Reset Password OTP",
    //   text: `Here is your OTP: ${otp}`,
    // });
  } catch (err: any) {
    res.status(500).json({ message: "Error sending email. Please try again!" });
  }
};

export const verifyResetPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { otp, email } = (req.session as any).resetDetails;
    if (!otp) {
      res.status(400).json({ message: "OTP expired. Please try again!" });
      return;
    }
    if (otp.toString() !== req.body.otp.toString()) {
      res.status(400).json({ message: "Invalid OTP. Please try again!" });
      return;
    }

    (req.session as any).resetDetails = { email };
    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (err: any) {
    res.status(500).json({ message: "Error verifying OTP. Please try again!" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = (req.session as any).resetDetails;
    if (!email) {
      res
        .status(403)
        .json({ message: "Session is expired. Please try again!" });
      return;
    }
    if (!req.body.newPassword) {
      res.status(400).json({ message: "New password is required!" });
      return;
    } else if (!req.body.verifyNewPassword) {
      res.status(400).json({ message: "Verify new password is required!" });
      return;
    } else if (req.body.newPassword !== req.body.verifyNewPassword) {
      res.status(400).json({ message: "Passwords do not match!" });
      return;
    }
    await User.findOneAndUpdate(
      { email },
      { password: await User.encryptPassword(req.body.newPassword) },
      { runValidators: true }
    );
    (req.session as any).resetDetails = null;
    req.session.cookie = null;
    req.session.destroy(() => {
      res.status(200).json({ message: "Password reset successfully!" });
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Error resetting password. Please try again!" });
  }
};
