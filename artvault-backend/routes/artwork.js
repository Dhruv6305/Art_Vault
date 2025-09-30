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
    console.log("📁 Storage destination check:");
    console.log("  - File:", file.originalname);
    console.log("  - MIME:", file.mimetype);

    let uploadPath = "src/uploads/";
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const threeDExtensions = ['.fbx', '.obj', '.blend', '.dae', '.3ds', '.ply', '.stl', '.gltf', '.glb', '.x3d', '.ma', '.mb'];

    console.log("  - Extension:", fileExtension);
    console.log("  - Is 3D:", threeDExtensions.includes(fileExtension));

    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath += "videos/";
    } else if (file.mimetype.startsWith("audio/")) {
      uploadPath += "audio/";
    } else if (threeDExtensions.includes(fileExtension)) {
      uploadPath += "3d_models/";
      console.log("  📦 Using 3D models directory");
    } else {
      uploadPath += "documents/";
    }

    console.log("  - Final path:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    console.log("  - Generated filename:", fileName);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("🔍 File filter check:");
  console.log("  - Original name:", file.originalname);
  console.log("  - MIME type:", file.mimetype);

  // Allow images, videos, audio, documents, and 3D models
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
    // Add common 3D model MIME types
    "application/octet-stream", // Many 3D files use this generic type
    "model/gltf+json",
    "model/gltf-binary",
  ];

  // 3D model file extensions (check by extension since MIME types vary)
  const threeDExtensions = ['.fbx', '.obj', '.blend', '.dae', '.3ds', '.ply', '.stl', '.gltf', '.glb', '.x3d', '.ma', '.mb'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  console.log("  - File extension:", fileExtension);
  console.log("  - Is 3D extension:", threeDExtensions.includes(fileExtension));
  console.log("  - Is allowed MIME:", allowedTypes.includes(file.mimetype));

  const isAllowed = allowedTypes.includes(file.mimetype) || threeDExtensions.includes(fileExtension);

  if (isAllowed) {
    console.log("  ✅ File accepted");
    cb(null, true);
  } else {
    console.log("  ❌ File rejected");
    cb(
      new Error(
        `Invalid file type. File: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${fileExtension}`
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

// Test 3D file upload specifically
router.post("/test-3d-upload", authMiddleware, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "No file uploaded" });
    }

    console.log("🎲 3D Test upload successful:");
    console.log("  - Original name:", req.file.originalname);
    console.log("  - MIME type:", req.file.mimetype);
    console.log("  - Size:", req.file.size);
    console.log("  - Path:", req.file.path);

    res.json({
      success: true,
      message: "3D file upload test successful!",
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error("3D upload test error:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = router;
