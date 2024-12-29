import express from "express";
import { connectDB } from "./config/database.js";

const port = 3001;
const app = express();

connectDB()
  .then(() => {
    console.log("Connected database successfully");

    app.listen(port, () => {
      console.log("listening on port ", port);
    });
  })
  .catch((err) => {
    console.log("Error connecting database");
  });
