import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "bwu4hzuc",
  api_key: process.env.CLOUDINARY_API_KEY || "838626792516452",
  api_secret: process.env.CLOUDINARY_API_SECRET || "2XWAPp3prNsF3HGncI3crZPia_Q",
  secure: true,
});

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Uploads a base64 or file buffer to Cloudinary with optimized settings
 */
export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder: string = "fab-basic/products",
  customPublicId?: string
): Promise<UploadResult> {
  const options: Record<string, any> = {
    folder,
    resource_type: "image",
    transformation: [
      { quality: "auto:best" },
      { fetch_format: "auto" },
    ],
  };

  if (customPublicId) {
    options.public_id = customPublicId;
  }

  const result = await cloudinary.uploader.upload(fileBase64OrUrl, options);

  return {
    url: result.url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
  };
}

/**
 * Safely deletes an image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return false;
  }
}

export default cloudinary;
