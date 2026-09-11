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

async function bulkUploadToCloudinary() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const sites = await Site.find();

    console.log(`${sites.length} kayıt bulundu.`);

    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const site of sites) {
      try {
        console.log(`\n${site.name}`);

        if (!site.image) {
          console.log("Image alanı boş.");
          skipped++;
          continue;
        }

        // Mongo'da kayıtlı dosya adı
        const fileName = path.basename(site.image);

        // Önce timestamp isimli dosyayı dene
        let imagePath = path.resolve(
          __dirname,
          "../uploads/sites/wiki",
          fileName
        );

        // Bulamazsa id_no.jpg dene (57 manuel eklenen görsel)
        if (!fs.existsSync(imagePath)) {
          imagePath = path.resolve(
            __dirname,
            "../uploads/sites/wiki",
            `${site.id_no}.jpg`
          );
        }

        // Hâlâ bulunamadıysa geç
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

        console.log(
          `(${uploaded}/${sites.length}) Upload tamamlandı.`
        );
      } catch (err) {
        failed++;

        console.log(`Hata: ${site.name}`);
        console.log(err.message);
      }
    }

    console.log("\n==============================");
    console.log("BULK UPLOAD TAMAMLANDI");
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

bulkUploadToCloudinary();