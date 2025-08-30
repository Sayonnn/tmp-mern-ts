import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || "upguard",
  host: process.env.DB_HOST || "postgres",
  database: process.env.DB_NAME || "db_upguard",
  password: process.env.DB_PASSWORD || "upguard19!",
  port: process.env.DB_PORT || 5432,
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello Future DevOps" });
});

app.get("/api", (req, res) => {
  res.json("Hello Future DevOps Engineer");
});

// Test DB connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db_time: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
