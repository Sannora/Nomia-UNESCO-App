import express from "express"
import { getSites, getSiteById, getCountries, addSiteImage } from "../controllers/siteController.js"
import { uploadSiteImage } from "../middleware/upload.js";

const router = express.Router();

// Tüm site'ları çek
router.get("/", getSites);

// Ülkeleri çek
router.get("/countries", getCountries);

/* Parametreli route'lar en sonda olmalı */

// Site görseli yükle
router.post(
    "/:id/image",
    uploadSiteImage.single("image"),
    addSiteImage
);

// ID'ye göre tekli site çek
router.get("/:id", getSiteById);


export default router;