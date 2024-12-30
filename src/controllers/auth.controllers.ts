import { Request, Response } from "express";
import { User } from "../models/user.models";
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
    const jwtToken = await newUser.getJWT();
    res.cookie("token", jwtToken);
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
    const { email, password } = req.body;
    const getUser = await User.findOne({ email: email });
    if (!getUser) {
      throw new Error("Invalid Credentials!");
    }
    const isValidPassword = await getUser.decryptPassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials!");
    }
    const jwtToken = await getUser.getJWT();
    res.cookie("token", jwtToken);
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
    res.clearCookie("token");
    res.status(200).json({ message: "LoggedOut successfully!" });
  } catch (err: any) {
    res.status(500).json({ message: "Error loging out. Please try again!" });
  }
};
