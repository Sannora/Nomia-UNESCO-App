import Site from "../models/Site.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import path from "path";
import fs from "fs";
import { logAdminAction } from "../utils/logger.js";

// Normalizasyon fonskiyonu
function normalizeInput(input = "") {
  return input
    .toLowerCase()
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Tüm site'ları getir ya da site'lar arasından filtrele
export const getSites = async (req, res) => {

  try {
    const {category, region, country, search} = req.query;
    const filter = {};

    // Kategori filtresi
    if(category) {
      filter.category = category;
    }

    // Bölge filtresi
    if (region && region !== "Worldwide") {
      filter.region = region;
    }
    
    // Ülke filtresi
    if (country) {
      filter.country = country;
    }

    // Arama çubuğu araması
    // Mongo filtresi
    let sites = await Site.find(filter);

    // Arama varsa Node tarafında yap
    if (search) {
      const normalizedSearch = normalizeInput(search);

      sites = sites.filter((site) => {
        const normalizedName = normalizeInput(site.name);
        return normalizedName.includes(normalizedSearch);
      });
    }

    res.status(200).json(sites);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Sites could not be fetched.",
    })
  }

};

// ID'ye göre tek site getir
export const getSiteById = async (req, res) => {
  try {
    const singleSite = await Site.findById(req.params.id);
    if (!singleSite) {
      return res.status(404).json({ message: "Site not found." });
    }
    res.status(200).json(singleSite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ülkeler listesini çek
export const getCountries = async (req, res) => {
  try {
    const countries = await Site.distinct("country");
    res.status(200).json(countries)
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// Site görseli ekle
export const addSiteImage = async (req, res) => {
  try {
    // Görsel eklenecek site'ın ID'si
    const siteId = req.params.id;

    // Site var mı kontrol et
    const site = await Site.findById(siteId);
    if (!site) {
      return errorResponse(res, "Site bulunamadı.", 404);
    }

    // Dosya geldi mi?
    if (!req.file) {
      return errorResponse(req, "Dosya yüklenmedi.", 400);
    }

    // Eski görsel varsa sil
    if (site.image) {
      const oldImagePath = path.join(process.cwd(), site.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.warn("Eski görsel silinirken hata oluştu:", err.message);
        }
      });
    }

    // Dosya yolu
    site.imagePath = `/uploads/sites/${req.file.filename}`;

    // Veritabanını güncelle
    site.image = imagePath;

    //Kaydet
    await site.save();

    // Kaydı logla
    await logAdminAction(
      "SITE_IMAGE_UPDATED",
      site._id,
      { image: imagePath }
    );

    // Standart yanıt
    return successResponse(
      res,
      {
        siteId: site._id,
        imageUrl: imagePath,
      },
      "Görsel baraşıyla yüklendi."
    );
  } catch (error) {
    console.error("Görsel yüklenirken hatayla karşılaştı:", error);
    return errorResponse(res, "Görsel yüklenirken hata oluştu.")

  }
}

// Çoklu görsel yükleme
export const addBulkSiteImages = async (req, res) => {
  try {
    const { mappings } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return errorResponse(res, "Dosya bulunamadı.", 400);
    }

    const parsedMappings = JSON.parse(mappings);
    const results = [];

    for (const file of files) {
      const siteId = parsedMappings[file.originalname];
      if (!siteId) continue;

      const site = await Site.findById(siteId);
      if (!site) continue;

      // Eski görsel sil
      if (site.image) {
        const oldPath = path.join(process.cwd(), site.image);
        fs.unlink(oldPath, () => {});
      }

      const imagePath = `/uploads/sites/${file.filename}`;
      site.image = imagePath;
      await site.save();

      results.push({
        siteId,
        imageUrl: imagePath,
      });
    }

    return successResponse(res, results, "Bulk upload tamamlandı.");

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Bulk upload sırasında hata.");
  }
};
