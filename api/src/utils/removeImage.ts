import { unlink } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";

export const removeImage = async (
  imageData: Prisma.InputJsonValue,
  folder: string
) => {
  try {
    const image: any = imageData;

    if (process.env.NODE_ENV === "production") {
      // Remove from Cloudinary
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    } else {
      // Remove from local storage
      const filename = image.url.split("/").pop();
      if (filename) {
        const filePath = path.join(
          __dirname,
          "../../uploads",
          folder,
          filename
        );
        await unlink(filePath);
      }
    }
  } catch (error) {
    console.error("Error removing image:", error);
  }
};
