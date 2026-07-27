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

// Wikipedia API
const wikiApi = axios.create({
  baseURL: "https://en.wikipedia.org/w/api.php",
  headers: {
    "User-Agent": "NomiaApp/1.0 (https://example.com; contact@example.com)"
  }
});

// Commons API
const commonsApi = axios.create({
  baseURL: "https://commons.wikimedia.org/w/api.php",
  headers: {
    "User-Agent": "NomiaApp/1.0 (https://example.com; contact@example.com)"
  }
});

export async function fetchImageForSite(siteName) {
  const pageRes = await wikiApi.get("", {
    params: {
      action: "query",
      titles: siteName,
      prop: "pageimages",
      piprop: "original",
      format: "json",
      redirects: 1
    }
  });

  const pages = pageRes.data?.query?.pages;
  const page = Object.values(pages)[0];

  if (!page?.original?.source) {
    return null;
  }

  // URL’den dosya adını çek
  const fileNameFromUrl = decodeURIComponent(
    page.original.source.split("/").pop()
  );

  // Commons → gerçek indirilebilir URL
  const commonsRes = await commonsApi.get("", {
    params: {
      action: "query",
      titles: `File:${fileNameFromUrl}`,
      prop: "imageinfo",
      iiprop: "url",
      format: "json"
    }
  });

  const commonsPages = commonsRes.data?.query?.pages;
  const imageUrl =
    Object.values(commonsPages)[0]?.imageinfo?.[0]?.url;

  if (!imageUrl) {
    return null;
  }

  // Görseli indir
  const localFileName = `wiki-${Date.now()}.jpg`;
  const filePath = path.join(UPLOAD_DIR, localFileName);

  const imageResponse = await axios.get(imageUrl, {
    responseType: "stream",
    headers: {
      "User-Agent": "NomiaApp/1.0"
    }
  });

  const writer = fs.createWriteStream(filePath);
  imageResponse.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  return `/uploads/sites/wiki/${localFileName}`;
}
