import express from "express";
import { config } from "./configs/index.js";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import { pool } from "./configs/database.js";
import { corsConfig } from "./configs/cors.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

/** Middlewares */
app.use(morgan("dev"));
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** Index Routes */
app.use("/api", indexRoutes);

/** Index Route */
app.get("/", (_, res) => {
  res.json({ message: "Welcome to " + config.app.coolName + " | The number 1 website Performance booster and Web Monitoring Service" });
});

/** Test API Endpoint */
app.get("/api-test", (_, res) => {
  try {
    res.json("Backend API Connection Successful");
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message});
  }
});

/** Test DB connection */
app.get("/db-test", async (_, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db_time: result.rows[0], message: "Database connection successful" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
