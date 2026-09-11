import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(
  __dirname,
  "../uploads/sites/wiki"
);

const OUTPUT_DIR = path.resolve(
  __dirname,
  "../uploads/sites/optimized"
);

// Çoklu görsel işleme değişkeni
const CONCURRENCY = 8;

async function resizeImage(file, index, total) {
  const inputPath = path.join(SOURCE_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);

  try {
    await sharp(inputPath)
      .resize({
        width: 400,
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(outputPath);

    const original = await fs.stat(inputPath);
    const resized = await fs.stat(outputPath);

    const saved = (
      (1 - resized.size / original.size) *
      100
    ).toFixed(1);

    console.log(
      `(${index + 1}/${total}) ${file} | ${(original.size / 1024).toFixed(0)} KB → ${(resized.size / 1024).toFixed(0)} KB | -${saved}%`
    );

    return true;
  } catch (err) {
    console.log(
      `(${index + 1}/${total}) ${file}`
    );
    console.log(err.message);
    return false;
  }
}

async function resizeImages() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const files = await fs.readdir(SOURCE_DIR);

  const images = files.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  console.log(`\n${images.length} görsel bulundu.\n`);
  console.log(`${CONCURRENCY} paralel işlem başlatılıyor...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i += CONCURRENCY) {
    const batch = images.slice(i, i + CONCURRENCY);

    const results = await Promise.all(
      batch.map((file, batchIndex) =>
        resizeImage(
          file,
          i + batchIndex,
          images.length
        )
      )
    );

    success += results.filter(Boolean).length;
    failed += results.filter(v => !v).length;
  }

  console.log("\n==============================");
  console.log("TÜM GÖRSELLER İŞLENDİ");
  console.log("==============================");
  console.log(`Başarılı : ${success}`);
  console.log(`Başarısız: ${failed}`);
  console.log(`Çıktı    : ${OUTPUT_DIR}`);
}

resizeImages();