const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

console.log("🔍 Debugging Upload Endpoint");
console.log("============================");

// Test 1: Check if uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
console.log("\n📁 Directory Check:");
console.log("- Uploads directory exists:", fs.existsSync(uploadsDir));

if (fs.existsSync(uploadsDir)) {
  const subdirs = fs.readdirSync(uploadsDir);
  console.log("- Subdirectories:", subdirs);

  // Check permissions
  try {
    const testFile = path.join(uploadsDir, "test-write.txt");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    console.log("- Write permissions: ✅ OK");
  } catch (error) {
    console.log("- Write permissions: ❌ FAILED -", error.message);
  }
} else {
  console.log("❌ Creating uploads directory...");
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, "3d_models"), { recursive: true });
  fs.mkdirSync(path.join(uploadsDir, "images"), { recursive: true });
  console.log("✅ Created uploads directory structure");
}

// Test 2: Test multer configuration
console.log("\n⚙️ Multer Configuration Test:");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Multer destination called for:", file.originalname);

    let uploadPath = "uploads/";
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const threeDExtensions = [
      ".fbx",
      ".obj",
      ".blend",
      ".dae",
      ".3ds",
      ".ply",
      ".stl",
      ".gltf",
      ".glb",
    ];

    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (threeDExtensions.includes(fileExtension)) {
      uploadPath += "3d_models/";
    } else {
      uploadPath += "documents/";
    }

    console.log("📂 Destination path:", uploadPath);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      console.log("📁 Creating directory:", uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    console.log("📝 Generated filename:", fileName);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(
    "🔍 File filter check for:",
    file.originalname,
    "MIME:",
    file.mimetype
  );

  const threeDExtensions = [
    ".fbx",
    ".obj",
    ".blend",
    ".dae",
    ".3ds",
    ".ply",
    ".stl",
    ".gltf",
    ".glb",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/octet-stream",
    "model/gltf+json",
    "model/gltf-binary",
  ];

  const isAllowed =
    allowedTypes.includes(file.mimetype) ||
    threeDExtensions.includes(fileExtension);

  console.log("✅ File accepted:", isAllowed);
  cb(null, isAllowed);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

console.log("✅ Multer configuration created successfully");

// Test 3: Check if route handler exists
console.log("\n🛣️ Route Handler Check:");
try {
  const artworkController = require("./controllers/artworkController");
  console.log(
    "- uploadFiles function exists:",
    typeof artworkController.uploadFiles === "function"
  );
} catch (error) {
  console.log("❌ Error loading controller:", error.message);
}

// Test 4: Simulate file upload process
console.log("\n🧪 Simulating Upload Process:");

// Create a mock file object
const mockFile = {
  originalname: "test-model.gltf",
  mimetype: "model/gltf+json",
  fieldname: "files",
  size: 1024,
};

console.log("📄 Mock file:", mockFile);

// Test destination function
storage.getDestination({}, mockFile, (err, destination) => {
  if (err) {
    console.log("❌ Destination error:", err);
  } else {
    console.log("✅ Destination result:", destination);
  }
});

// Test filename function
storage.getFilename({}, mockFile, (err, filename) => {
  if (err) {
    console.log("❌ Filename error:", err);
  } else {
    console.log("✅ Filename result:", filename);
  }
});

console.log("\n📋 Debug Summary:");
console.log("1. Check if backend server is running on port 5000");
console.log("2. Check if /api/artworks/upload endpoint is accessible");
console.log("3. Check browser network tab for upload requests");
console.log("4. Check backend console for upload logs");
console.log("5. Verify JWT token is being sent with requests");
