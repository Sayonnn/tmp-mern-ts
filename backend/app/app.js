import express from "express";
import mongoose from "mongoose"; // needed for /db-test
import { config } from "./configs/index.js";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import { corsConfig } from "./configs/cors.js";
import indexRoutes from "./routes/index.routes.js";
import connectDB from "./configs/database.js";

const app = express();

/** Connect to MongoDB */
connectDB();

/** Middlewares */
app.use(morgan("dev"));
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** Index Routes */
app.use("/api", indexRoutes);

/** Root Route */
app.get("/", (_, res) => {
  res.json({
    message: `Welcome to ${config.app.coolName} | The number 1 website Performance booster and Web Monitoring Service`,
  });
});

/** Test API Endpoint */
app.get("/api-test", (_, res) => {
  res.json({ message: "Backend API Connection Successful" });
});

/** Test DB connection */
app.get("/db-test", async (_, res) => {
  try {
    connectDB();

    res.json({
      db_time: new Date(),
      message: "MongoDB connection successful",
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
