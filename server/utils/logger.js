import connectDB from "../config/db.js";

export const logAdminAction = async (
  action,
  siteId,
  meta = {}
) => {
  try {
    const db = await connectDB();

    await db.collection("adminlogs").insertOne({
      action,
      siteId,
      meta,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Admin log error:", err.message);
  }
};