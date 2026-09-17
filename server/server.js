import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import siteRoutes from "./routes/siteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sites", siteRoutes);

export default app;