import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";

import app from "./server.js";

app.locals.getD1 = () => {
  return env.nomia_db;
};

app.locals.getCloudinaryConfig = () => {
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  };
};

app.locals.getAdminSecret = () => {
  return env.ADMIN_SECRET;
};

app.listen(3000);

export default httpServerHandler({
  port: 3000,
});