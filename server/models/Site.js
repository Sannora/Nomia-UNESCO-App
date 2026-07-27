import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  id_no: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["Cultural", "Natural", "Mixed"],
    default: "Cultural",
  },
  region: {
    type: String,
    index: true,
  },
  country: {
    type: String,
    index: true,
  },
  shortDescription: {
    type: String,
    maxlength: 2500,
  },
  longDescription: {
    type: String,
  },
  dateInscribed: {
    type: Number,
  },
  danger: {
    type: Boolean,
    default: false,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  image: {
    type: String,
    default: "../uploads/sites/0site-placeholder.png",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  imageFetchStatus: {
    type: String,
    enum: ["success", "not_found", "rate_limited", "error", "manual", "missing"],
    default: null
  },
  imageFetchTriedAt: {
    type: Date,
    default: null
  },
  imageFetchFailCount: {
  type: Number,
  default: 0
  },
});

siteSchema.index({ name: 'text', shortDescription: 'text', longDescription: 'text' });

export default mongoose.model("Site", siteSchema, "sites");
