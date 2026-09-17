import { getD1 } from "../config/d1.js";
import {
  uploadSiteImageToCloudinary,
} from "../utils/cloudinary.js";

export const getSites = async (req, res) => {
  try {
    const {
      category,
      region,
      country,
      search,
      limit = 1000,
    } = req.query;

    const db = getD1(req);

    const parsedLimit = Math.min(
      Math.max(Number(limit) || 1000, 1),
      1000
    );

    const conditions = [];
    const params = [];

    if (category) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (region && region !== "Worldwide") {
      conditions.push("region = ?");
      params.push(region);
    }

    if (country) {
      conditions.push("country = ?");
      params.push(country);
    }

    if (search) {
      conditions.push(
        "LOWER(name) LIKE LOWER(?)"
      );
      params.push(`%${search}%`);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const query = `
      SELECT
        id,
        id_no,
        name,
        category,
        region,
        country,
        shortDescription,
        dateInscribed,
        danger,
        latitude,
        longitude,
        image
      FROM sites
      ${whereClause}
      LIMIT ?
    `;

    params.push(parsedLimit);

    const result = await db
      .prepare(query)
      .bind(...params)
      .all();

    const sites = result.results.map((site) => ({
      _id: site.id,
      id_no: site.id_no,
      name: site.name,
      category: site.category,
      region: site.region,
      country: site.country,
      shortDescription: site.shortDescription,
      dateInscribed: site.dateInscribed,
      danger: Boolean(site.danger),
      coordinates: {
        lat: site.latitude,
        long: site.longitude,
      },
      image: site.image,
    }));

    res.status(200).json(sites);
  } catch (error) {
    console.error(
      "Sites fetch error:",
      error
    );

    res.status(500).json({
      message: "Sites could not be fetched.",
    });
  }
};

export const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getD1(req);

    const result = await db
      .prepare(`
        SELECT
          id,
          id_no,
          name,
          category,
          region,
          country,
          shortDescription,
          longDescription,
          dateInscribed,
          danger,
          latitude,
          longitude,
          image
        FROM sites
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!result) {
      return res.status(404).json({
        message: "Site not found.",
      });
    }

    const site = {
      _id: result.id,
      id_no: result.id_no,
      name: result.name,
      category: result.category,
      region: result.region,
      country: result.country,
      shortDescription: result.shortDescription,
      longDescription: result.longDescription,
      dateInscribed: result.dateInscribed,
      danger: Boolean(result.danger),
      coordinates: {
        lat: result.latitude,
        long: result.longitude,
      },
      image: result.image,
    };

    res.status(200).json(site);
  } catch (error) {
    console.error(
      "Site fetch error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCountries = async (req, res) => {
  try {
    const db = getD1(req);

    const result = await db
      .prepare(`
        SELECT DISTINCT country
        FROM sites
        WHERE country IS NOT NULL
          AND country != ''
        ORDER BY country ASC
      `)
      .all();

    const countries = result.results.map(
      (row) => row.country
    );

    res.status(200).json(countries);
  } catch (error) {
    console.error(
      "Countries fetch error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const addSiteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const db = getD1(req);

    const site = await db
      .prepare(`
        SELECT
          id,
          id_no,
          name,
          image
        FROM sites
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!site) {
      return res.status(404).json({
        message: "Site not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required.",
      });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (
      !allowedTypes.includes(
        req.file.mimetype
      )
    ) {
      return res.status(400).json({
        message:
          "Only JPEG, PNG, WebP and AVIF images are allowed.",
      });
    }

    if (
      req.file.size >
      10 * 1024 * 1024
    ) {
      return res.status(400).json({
        message:
          "Image size cannot exceed 10 MB.",
      });
    }

    const publicId = `site-${site.id_no}`;

    const cloudinary =
      req.app.locals.getCloudinaryConfig();

    const uploadResult =
      await uploadSiteImageToCloudinary({
        file: req.file,
        publicId,
        cloudinary,
      });

    const imageUrl =
      uploadResult.secure_url;

    await db
      .prepare(`
        UPDATE sites
        SET image = ?
        WHERE id = ?
      `)
      .bind(imageUrl, id)
      .run();

    res.status(200).json({
      message:
        "Image uploaded successfully.",
      image: imageUrl,
    });
  } catch (error) {
    console.error(
      "Site image upload error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};