import dotenv from "dotenv";
import mongoose from "mongoose";
import Site from "../models/Site.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI yüklenmedi. .env yolu yanlış.");
  process.exit(1);
}

const [, , siteName, imageUrl] = process.argv;

if (!siteName || !imageUrl) {
  console.error(
    'Kullanım:\nnode manualImageAttach.js "Site Name" https://upload.wikimedia.org/...'
  );
  process.exit(1);
}

// Upload klasörü
const SERVER_ROOT = path.resolve(__dirname, "..");
const UPLOAD_DIR = path.join(SERVER_ROOT, "uploads", "sites", "wiki");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function run() {
  // Mongo bağlan
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Site bul
  const site = await Site.findOne({ name: siteName });

  if (!site) {
    console.error("Site bulunamadı:", siteName);
    process.exit(1);
  }

  // Görseli indir
  const fileName = `manual-${Date.now()}.jpg`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  console.log("Görsel indiriliyor...");

  const response = await axios.get(imageUrl, {
    responseType: "stream",
    headers: {
      "User-Agent": "NomiaApp/1.0",
    },
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // Mongo update
  site.image = `/uploads/sites/wiki/${fileName}`;
  site.imageFetchStatus = "manual";
  site.imageFetchTriedAt = new Date();
  await site.save();

  console.log("BAŞARILI!");
  console.log("Site:", site.name);
  console.log("Image:", site.image);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("💥 HATA:", err);
  process.exit(1);
});
