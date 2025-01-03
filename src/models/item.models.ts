import mongoose from "mongoose";
import validator from "validator";
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "boys", "girls"],
    },
    price: {
      type: Number,
      min: 1,
      required: true,
    },
    size: {
      type: [String],
      enum: ["small", "medium", "large"],
      required: true,
    },
    color: {
      type: [String],
      required: true,
      validate: (v: string[]) => {
        let isValid = true;
        v.forEach((color) => {
          if (!validator.isHexColor(color)) {
            isValid = false;
          }
        });
        return isValid;
      },
      message: "Color value should be a valid hex code",
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: [
        "https://imgs.search.brave.com/EO6EVqcKW0bB9CxhSCmV_v81W40uUk2yRCl849btIbU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9t/YWxlLWNsb3RoZXNf/MjMtMjE0NzYzNTUw/My5qcGc_c2VtdD1h/aXNfaHlicmlk",
      ],
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "INR",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model("Item", itemSchema);
