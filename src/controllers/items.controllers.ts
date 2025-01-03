import { Request, Response } from "express";
import { Item } from "../models/item.models";

export const addItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, size, category, color } =
      req.body;
    const { _id } = req.body.user;

    if (
      !(name && description && price && quantity && size && category && color)
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const item = new Item({
      name,
      description,
      price,
      quantity,
      size,
      category,
      color,
      user: _id,
    });

    await item.save();
    res.status(201).json({ message: "Item added successfully", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
