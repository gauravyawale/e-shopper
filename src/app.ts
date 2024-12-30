import express from "express";
import { connectDB } from "./config/database";
import { authRouter } from "./routes/auth.routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json());
/**
 * Middleware to parse incoming cookie.
 */
app.use(cookieParser());
/**
 * Handle routing for the /api endpoints.
 */
app.use("/api", authRouter);

/**
 * Connects to the database and starts the server on the specified port.
 * Logs success or error messages to the console.
 */
connectDB()
  .then(() => {
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log("Server running on port ", PORT);
    });
  })
  .catch((err) => {
    console.log("Error connecting database");
  });
