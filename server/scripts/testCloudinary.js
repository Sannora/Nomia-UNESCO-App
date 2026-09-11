import cloudinary from "../config/cloudinary.js";

console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

const result = await cloudinary.uploader.upload(
  "./../uploads/sites/wiki/wiki-1784559847957.jpg",
  {
    folder: "Nomia/Sites",
  }
);

console.log(result.secure_url);