import express from "express";
import { addItem, getItems } from "../controllers/items.controllers";
import { userAuth } from "../middlewares/auth.middlewares";

export const itemsRouter = express.Router();

itemsRouter.post("/item", userAuth, addItem);

itemsRouter.get("/items", userAuth, getItems);
