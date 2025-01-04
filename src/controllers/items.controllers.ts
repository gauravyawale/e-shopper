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

export const getItems = async (req: Request, res: Response) => {
  try {
    const { category, page, limit } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const itemLimit = parseInt(limit as string) || 10;
    console.log(req.query);
    const items = await Item.find({ category })
      .skip(skip)
      .limit(itemLimit)
      .populate("user", "firstName lastName email")
      .select(
        "name user price category description size color quantity images currency"
      );
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
