export const getD1 = (req) => {
  if (!req.app.locals.getD1) {
    throw new Error("D1 database bağlantısı hazır değil.");
  }

  return req.app.locals.getD1();
};