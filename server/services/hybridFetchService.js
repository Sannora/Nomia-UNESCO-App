import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server root
const SERVER_ROOT = path.resolve(__dirname, "..");
const UPLOAD_DIR = path.join(SERVER_ROOT, "uploads", "sites", "wiki");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const commonsApi = axios.create({
  baseURL: "https://commons.wikimedia.org/w/api.php",
  headers: {
    "User-Agent": "NomiaApp/1.0 (mmh.melih@gmail.com | https://github.com/Sannora)"
  },
  timeout: 20000
});

export async function fetchImageHybrid(siteName) {
  try {
    // Commons search
    const searchRes = await commonsApi.get("", {
      params: {
        action: "query",
        list: "search",
        srsearch: siteName,
        srnamespace: 6,
        srlimit: 5,
        format: "json"
      }
    });

    const results = searchRes.data?.query?.search;
    console.log(
      `[SEARCH] ${siteName} -> ${results?.length || 0} sonuç`
    );
    if (!results || results.length === 0) {
      return null;
    }

    // İlk dosyayı al
    const fileTitle = results[0].title;
    console.log(
      `[FILE] ${siteName} -> ${fileTitle}`
    );

    // Gerçek indirme URL'si
    const fileRes = await commonsApi.get("", {
      params: {
        action: "query",
        titles: fileTitle,
        prop: "imageinfo",
        iiprop: "url",
        format: "json"
      }
    });

    const pages = fileRes.data?.query?.pages;
    const imageUrl =
      Object.values(pages)[0]?.imageinfo?.[0]?.url;

    if (!imageUrl) {
      return null;
    }

    // Dosyayı indir
    const localFileName = `wiki-${Date.now()}.jpg`;
    const filePath = path.join(UPLOAD_DIR, localFileName);

    const imageResponse = await axios.get(imageUrl, {
      responseType: "stream",
      headers: { "User-Agent": "NomiaApp/1.0 (mmh.melih@gmail.com | https://github.com/Sannora)" }
    });

    const writer = fs.createWriteStream(filePath);
    imageResponse.data.pipe(writer);

    await new Promise((res, rej) => {
      writer.on("finish", res);
      writer.on("error", rej);
    });

    return `/uploads/sites/wiki/${localFileName}`;
  } catch (err) {
    
    console.log(
      `[ERROR] ${siteName}`,
      err.response?.status,
      err.message
    );
  
    if (err.response?.status === 429) {
      throw { type: "RATE_LIMIT" };
    }
  
    throw err;
  }
}
