import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "..", "data", "whc_sites_clean.json");
const outputPath = path.join(__dirname, "..", "data", "whc_sites_fixed.json");

const COUNTRY_REGION_MAP = {
  // Americas
  "United States of America": "Americas",
  "United States": "Americas",
  "USA": "Americas",
  "Canada": "Americas",
  "Mexico": "Americas",

  // Oceania
  "Australia": "Oceania",
  "New Zealand": "Oceania",
  "Fiji": "Oceania",
  "Samoa": "Oceania",
  "Papua New Guinea": "Oceania",
  "Solomon Islands": "Oceania",
  "Tonga": "Oceania",
  "Vanuatu": "Oceania",
  "Kiribati": "Oceania",

  // West Asia / Middle East
  "Saudi Arabia": "Asia",
  "Syria": "Asia",
  "Jordan": "Asia",
  "Lebanon": "Asia",
  "Yemen": "Asia",
  "Oman": "Asia",
  "Iraq": "Asia",
  "Israel": "Asia",
  "Turkey": "Asia",

  // North Africa
  "Algeria": "Africa",
  "Morocco": "Africa",
  "Tunisia": "Africa",
  "Egypt": "Africa",
  "Libya": "Africa",
};

function convert() {
  console.log("Bölge dönüştürme başlıyor...");

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  const updated = data.map((site) => {
    const country = site.country?.trim();
    const mappedRegion = COUNTRY_REGION_MAP[country];

    const newRegion = mappedRegion || site.region;

    return {
      ...site,
      region: newRegion,
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));

  console.log("Dönüşüm tamamlandı");
  console.log("Yeni dosya:", outputPath);
}

convert();
