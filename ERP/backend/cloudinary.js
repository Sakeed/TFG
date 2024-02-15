import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "dhtuagdvo",
  api_key: "225467487676422",
  api_secret: "***************************",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "files",
  allowedFormats: ["jpg", "png", "pdf", "docx"],
  params: {
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export default storage;
