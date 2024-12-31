import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { IUser, IUserModel } from "../types/user.types";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: "Email is not valid",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: string) {
          return validator.isDate(value, {
            format: "DD/MM/YYYY",
          });
        },
        message: "Date must be in DD/MM/YYYY format",
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    images: { type: [String] },
  },
  { timestamps: true }
);

userSchema.statics.encryptPassword = async function (
  password: string
): Promise<string> {
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be minimum 8 characters long and should contain at least one lowercase, one uppercase, one numeric and one special character"
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

userSchema.methods.decryptPassword = async function (
  password: string
): Promise<boolean> {
  const isValidPassword = await bcrypt.compare(password, this.password);
  return isValidPassword;
};

//TODO: add if required
// userSchema.methods.getJWT = async function (): Promise<string> {
//   const jwtToken = await jwt.sign(
//     {
//       userId: this._id,
//     },
//     process.env.SECRET_KEY,
//     { expiresIn: "1h" }
//   );
//   return jwtToken;
// };

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
