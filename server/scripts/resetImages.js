import dotenv from "dotenv";
import mongoose from "mongoose";
import Site from "../models/Site.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI bulunamadı");
  process.exit(1);
}

async function resetImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const result = await Site.updateMany(
      { image: { $exists: true } },
      { $unset: { image: "" } }
    );

    console.log(`Image alanı silinen kayıt sayısı: ${result.modifiedCount}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("HATA:", err);
    process.exit(1);
  }
}

resetImages();
