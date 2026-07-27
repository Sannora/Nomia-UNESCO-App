import axios from "axios";
import fs from "fs";
import path from "path";

// Kendini tanıtacak bir axios instance oluştur
const wikiApi = axios.create({
    baseURL: "https://commons.wikimedia.org/w/api.php",
    headers: {
        "User-Agent": "NomiaApp/1.0"
    }
})

export const fetchImageFromCommons = async (siteName) => {

    // İlk istek: kategori üzerinden elde edeceğimiz ilk görseli çekmek
    const categoryRes = await wikiApi.get(
        "https://commons.wikimedia.org/w/api.php",
        {
            params: {
                action: "query",
                list: "categorymembers",
                cmtitle: `Category:${siteName}`,
                cmtype: "file",
                cmlimit: 1,
                format: "json",
                origin: "*",
            },
        }
    )

    // Alınan cevaptan dosya adını çek
    const files = categoryRes.data?.query?.categorymembers;

    if (!files || files.length === 0) {
        throw new Error("Kategori aramasında görsel bulunamadı.");
        return null;
    }

    const fileTitle = files[0].title;

    // İkinci istek: ilk istekte elde ettiğimiz görselin URL'sini çekmek
    const fileRes = await wikiApi.get(
        "https://commons.wikimedia.org/w/api.php",
        {
            params: {
                action: "query",
                titles: fileTitle,
                prop: "imageinfo",
                iiprop: "url",
                format: "json",
                origin: "*",
            }
        }
    )

    // Alınan cevaptan görsel URL'sini çek
    const pages = fileRes.data?.query?.pages;

    const imageUrl = Object.values(pages)[0]?.imageinfo?.[0]?.url;

    if (!imageUrl) {
        return null;
    }

    // Görsel URL'sini kaydet
    const imageResponse = await wikiApi.get(imageUrl, {
        responseType: "stream",
    });

    // Eşsiz dosya ismi oluştur
    const fileName = `wikisite-${Date.now()}.jpg`;

    // Bu isimle dosyayı kaydet
    const uploadPath = path.join(
        "uploads",
        "sites",
        "wiki",
        fileName
    )

    // Dosyayı yaz
    const writer = fs.createWriteStream(uploadPath);

    imageResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    })

    // Kaydedilen dosya yolunu döndür
    return `../uploads/sites/wiki/${fileName}`;
}