import path from "path";
import fs from "fs";
import { Prisma } from "@prisma/client";
import { cloudinary } from "@/config";
import error from "./throwError";

export interface ImageUploadResult {
  url: string;
  public_id?: string;
}

export const uploadImage = async (
  file: Express.Multer.File,
  folderName: string,
  existingPublicId?: string
): Promise<Prisma.InputJsonValue> => {
  if (!file) throw error(400, "No file provided");

  try {
    if (process.env.NODE_ENV === "production") {
      // Cloudinary upload
      const uploadOptions = {
        folder: folderName,
      };

      if (existingPublicId) {
        // For updates - destroy existing image
        await cloudinary.uploader.destroy(existingPublicId);
      }

      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
      return {
        name: result.original_filename,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      };
    }

    // Local development - store in uploads/[folderName]
    const uploadDir = path.join(__dirname, "../../uploads", folderName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    const filePath = path.join(uploadDir, filename);

    fs.renameSync(file.path, filePath);
    return {
      url: `/uploads/${folderName}/${filename}`,
      name: filename,
    };
  } catch (error: any) {
    fs.unlinkSync(file.path); // Cleanup temp file
    throw error(415, `Image upload failed: ${error.message}`);
  }
};

// Helper to extract public ID from existing image data
export const getPublicId = (imageData: Prisma.JsonValue): string | null => {
  if (typeof imageData === "object" && imageData !== null) {
    return (imageData as any).public_id || null;
  }
  return null;
};
