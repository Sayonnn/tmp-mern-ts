import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadBase = path.resolve(__dirname, "../uploads");
const allowed = [
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
];

/**
 * Storage engine
 */
const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    let folder = uploadBase;

    if (file.mimetype.startsWith("image/")) folder = path.join(uploadBase, "images");
    else if (file.mimetype.startsWith("video/")) folder = path.join(uploadBase, "videos");
    else if (file.mimetype.startsWith("audio/")) folder = path.join(uploadBase, "audios");
    else if (file.mimetype === "application/pdf") folder = path.join(uploadBase, "docs");

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

/**
 * File filter
 * @param {*} _ 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (_, file, cb) => {
  if (
    allowed.includes(file.mimetype) ||
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("audio/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;