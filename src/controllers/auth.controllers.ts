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
