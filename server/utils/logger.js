import AdminLog from "../models/AdminLog.js";

export const logAdminAction = async (action, siteId, meta = {}) => {
  try {
    await AdminLog.create({
      action,
      siteId,
      meta,
    });
  } catch (err) {
    console.error("Admin log error:", err.message);
  }
};