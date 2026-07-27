import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import siteRoutes from "./routes/siteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB bağlan
connectDB();

// Statik serve
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/sites", siteRoutes);

export default app;
