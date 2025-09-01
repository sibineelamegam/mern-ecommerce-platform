import multer from "multer";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const UPLOAD_DIR = path.join(__dirname, "../uploads");

const storage = multer.memoryStorage();
const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, allowedTypes.includes(file.mimetype)),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");

const computeHash = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

export const handleImageUpload = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return next();

    try {
      const hash = computeHash(req.file.buffer);
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filename = `${hash}${ext}`;
      const fullPath = path.join(UPLOAD_DIR, filename);

      await fs.mkdir(UPLOAD_DIR, { recursive: true });

      try {
        await fs.access(fullPath); // already exists
      } catch {
        await fs.writeFile(fullPath, req.file.buffer); // save new file
      }

      req.file.filename = filename; // attach for controller
      next();
    } catch (error) {
      next(error);
    }
  });
};
