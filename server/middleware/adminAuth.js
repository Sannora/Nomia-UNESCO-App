export const requireAdmin = (req, res, next) => {
  const adminSecret =
    req.app.locals.getAdminSecret?.();

  if (!adminSecret) {
    return res.status(500).json({
      message:
        "Admin authentication is not configured.",
    });
  }

  const authorization =
    req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin authentication required.",
    });
  }

  const token = authorization.slice(7);

  if (token !== adminSecret) {
    return res.status(403).json({
      message: "Invalid admin credentials.",
    });
  }

  next();
};