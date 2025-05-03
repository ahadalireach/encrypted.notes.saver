import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { checkLocation } from "./utils/geoCheck.js";
import connectDB from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.set("trust proxy", 1);
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api", checkLocation);
app.use("/api/", apiLimiter);
app.use("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.cyan.underline);
  });
});
