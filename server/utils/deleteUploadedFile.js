import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "../middleware/image.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const deleteUploadedFile = async (filename) => {
  if (!filename) return;

  try {
    // Check if any product still uses this image
    const usedInProducts = await Product.exists({ images: filename });
    // Check if any category still uses this image
    const usedInCategories = await Category.exists({ image: filename });

    if (usedInProducts || usedInCategories) return; // do not delete if still used

    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    console.log(`Deleted uploaded file: ${filename}`);
  } catch (err) {
    console.error(`Failed to delete file ${filename}:`, err.message);
  }
};
