import express from "express";

import {
  getSites,
  getSiteById,
  getCountries,
  addSiteImage,
} from "../controllers/siteController.js";

import { uploadSiteImage } from "../middleware/upload.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getSites);

router.get(
  "/countries",
  getCountries
);

router.post(
  "/:id/image",
  requireAdmin,
  uploadSiteImage.single("image"),
  addSiteImage
);

router.get(
  "/:id",
  getSiteById
);

export default router;