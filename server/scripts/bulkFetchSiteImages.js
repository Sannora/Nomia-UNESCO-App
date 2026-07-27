import dotenv from "dotenv";
import mongoose from "mongoose";
import Site from "../models/Site.js";
import { fetchImageHybrid } from "../services/hybridFetchService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Delay ayarları
const BASE_DELAY = 8000;
const RATE_LIMIT_DELAY = 30000;

async function bulkFetchImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  console.log("DB:", mongoose.connection.name);

  console.log(
    "Toplam site:",
    await Site.countDocuments()
  );

  const sites = await Site.find({
    $or: [
      { image: { $exists: false } },
      { image: null },
      { image: "" },
      { imageFetchStatus: { $in: ["not_found", "rate_limited", "error"] } }
    ],
    imageFetchStatus: { $ne: "missing" }
  });

  console.log(`${sites.length} site işlenecek`);

  let success = 0;
  let fail = 0;

  for (const site of sites) {
    console.log(`${site.name}`);

    // Diskte gerçekten varsa SKIP
    if (site.image) {
      const absolutePath = path.resolve("." + site.image);
      if (fs.existsSync(absolutePath)) {
        console.log("Görsel zaten var, geçildi");
        continue;
      }
    }

    try {
      const imagePath = await fetchImageHybrid(site.name);

      if (!imagePath) {
        site.imageFetchStatus = "missing";
        site.imageFetchTriedAt = new Date();
        await site.save();

        fail++;
        console.log("Görsel bulunamadı: missing");
      } else {
        site.image = imagePath;
        site.imageFetchStatus = "success";
        site.imageFetchTriedAt = new Date();
        await site.save();

        success++;
        console.log("Kaydedildi");
      }
    } catch (err) {
      const isRateLimit = err?.type === "RATE_LIMIT";

      site.imageFetchStatus = isRateLimit ? "rate_limited" : "error";
      site.imageFetchTriedAt = new Date();
      await site.save();

      fail++;

      console.log(
        isRateLimit
          ? "429 - RATE LIMITED, uzun bekleme"
          : `Hata: ${err.message}`
      );

      await sleep(
        isRateLimit
          ? RATE_LIMIT_DELAY
          : BASE_DELAY + Math.random() * 4000
      );

      continue;
    }

    //Normal delay
    await sleep(BASE_DELAY + Math.random() * 4000);
  }

  console.log("BULK BİTTİ");
  console.log(`Başarılı: ${success}`);
  console.log(`Başarısız: ${fail}`);

  await mongoose.disconnect();
  process.exit(0);
}

bulkFetchImages();
