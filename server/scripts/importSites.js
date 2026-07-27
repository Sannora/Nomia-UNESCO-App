import Site from "../models/Site.js";
import fs from "fs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config({ path: "../.env" });

// JSON veriyi oku
const data = JSON.parse(fs.readFileSync("../data/whc_sites_with_danger.json", "utf-8"));

const uploadData = async () => {
  try {
    // DB'ye bağlan
    await connectDB();

    // Tek seferlik yükleme
    await Site.insertMany(data);
    console.log("Tüm kayıtlar yüklendi.");
    process.exit();
  } catch (err) {
    console.error("Yükleme hatası:", err);
    process.exit(1);
  }
};

uploadData();
