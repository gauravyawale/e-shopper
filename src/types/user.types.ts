import { Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  dob: Date;
  role: "admin" | "user";
  decryptPassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  encryptPassword(password: string): Promise<string>;
}
