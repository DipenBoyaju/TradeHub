import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryFolder =
  | "services"
  | "user_profiles"
  | "marketplace"
  | "properties";

export async function uploadToCloudinary(fileString: string, subFolder: CloudinaryFolder): Promise<string> {
  if (fileString.startsWith("http")) {
    return fileString;
  }

  const targetFolder = `NepaHub/${subFolder}`;

  const result = await cloudinary.uploader.upload(fileString, {
    folder: targetFolder,
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  });

  return result.secure_url;
}