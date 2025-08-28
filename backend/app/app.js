import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello Future DevOps" });
});

export default app;
