import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: { type: String, enum: ["admin", "user"], required: true },
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      lowercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true, minLength: 8 },
    dob: { type: Date },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
