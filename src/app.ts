import express from "express";
import { connectDB } from "./config/database.config";
import { authRouter } from "./routes/auth.routes";
import dotenv from "dotenv";
import session from "express-session";
import { userRouter } from "./routes/users.routes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json());
/**
 * Session Middleware.
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
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
