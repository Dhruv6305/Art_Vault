const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
  getUserArtworks,
  likeArtwork,
  uploadFiles,
  uploadFolder,
  createArtworkFromFolder,
} = require("../controllers/artworkController");
const authMiddleware = require("../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "src/uploads/";

    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath += "videos/";
    } else if (file.mimetype.startsWith("audio/")) {
      uploadPath += "audio/";
    } else {
      uploadPath += "documents/";
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images, videos, audio, and some documents
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/webm",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/m4a",
    "audio/mpeg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, videos, audio files, and PDFs are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Public routes
router.get("/", getArtworks);
router.get("/:id", getArtworkById);

// Protected routes (require authentication)
router.post("/", authMiddleware, createArtwork);
router.put("/:id", authMiddleware, updateArtwork);
router.delete("/:id", authMiddleware, deleteArtwork);
router.get("/user/:userId", getUserArtworks);
router.post("/:id/like", authMiddleware, likeArtwork);

// File upload routes
router.post("/upload", authMiddleware, upload.array("files", 10), uploadFiles);

// Special multer config for folder uploads with better error handling
const folderUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/uploads/folders/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

router.post(
  "/upload-folder",
  authMiddleware,
  folderUpload.array("files", 100),
  uploadFolder
);
router.post("/create-from-folder", authMiddleware, createArtworkFromFolder);

// Test routes
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Artwork routes are working!" });
});

router.post("/test-upload", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Upload endpoint is accessible",
    user: req.user ? req.user.id : "No user",
    hasToken: !!req.headers.authorization,
  });
});

module.exports = router;
