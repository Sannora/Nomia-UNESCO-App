import dotenv from "dotenv";
import mongoose from "mongoose";
import Site from "../models/Site.js";
import cloudinary from "../config/cloudinary.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

async function uploadMissingImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const sites = await Site.find({
      $or: [
        { image: null },
        { image: "" },
        { image: { $exists: false } },
      ],
    });

    console.log(`${sites.length} eksik kayıt bulundu.`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const site of sites) {
      try {
        console.log(`\n${site.name}`);

        const fileName = `wiki-${String(site.id_no).trim()}.jpg`;

        const imagePath = path.resolve(
          __dirname,
          "../uploads/sites/wiki",
          fileName
        );

        console.log(`Aranan dosya: ${imagePath}`);

        if (!fs.existsSync(imagePath)) {
          console.log("Dosya bulunamadı.");
          skipped++;
          continue;
        }

        const result = await cloudinary.uploader.upload(imagePath, {
          folder: "Nomia/Sites",
          public_id: `site-${site.id_no}`,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
        });

        site.image = result.secure_url;
        await site.save();

        uploaded++;

        console.log(`(${uploaded}/${sites.length}) Upload tamamlandı.`);
      } catch (err) {
        failed++;

        console.log(`Hata: ${site.name}`);
        console.log(err.message);
      }
    }

    console.log("\n==============================");
    console.log("EKSİK GÖRSELLER TAMAMLANDI");
    console.log("==============================");
    console.log(`Başarılı : ${uploaded}`);
    console.log(`Atlanan  : ${skipped}`);
    console.log(`Hatalı   : ${failed}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error(err);

    await mongoose.disconnect();
    process.exit(1);
  }
}

uploadMissingImages();