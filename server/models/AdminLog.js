import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site",
  },
  meta: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AdminLog", adminLogSchema);