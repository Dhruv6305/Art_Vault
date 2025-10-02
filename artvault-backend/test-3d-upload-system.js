const fs = require("fs");
const path = require("path");

console.log("🧪 Testing 3D Upload System Configuration");
console.log("==========================================");

// Check upload directories
const uploadsDir = path.join(__dirname, "uploads");
const threeDDir = path.join(uploadsDir, "3d_models");

console.log("\n📁 Directory Structure:");
console.log("- Uploads dir exists:", fs.existsSync(uploadsDir));
console.log("- 3D models dir exists:", fs.existsSync(threeDDir));

if (fs.existsSync(uploadsDir)) {
  const subdirs = fs
    .readdirSync(uploadsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  console.log("- Subdirectories:", subdirs);
}

// Test file type detection
console.log("\n🔍 File Type Detection Test:");
const testFiles = [
  "model.fbx",
  "scene.gltf",
  "mesh.obj",
  "sculpture.stl",
  "character.blend",
];

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

testFiles.forEach((filename) => {
  const ext = path.extname(filename).toLowerCase();
  const is3D = threeDExtensions.includes(ext);
  console.log(`- ${filename}: ${is3D ? "✅ 3D Model" : "❌ Not 3D"}`);
});

// Test path conversion
console.log("\n🔄 Path Conversion Test:");
const testPaths = [
  "uploads/3d_models/files-123456789-987654321.fbx",
  "uploads\\3d_models\\files-123456789-987654321.gltf",
];

testPaths.forEach((testPath) => {
  const converted = testPath.replace(/\\/g, "/");
  console.log(`- ${testPath} -> ${converted}`);
});

console.log("\n✅ Upload system configuration check complete!");
console.log("📝 Next steps:");
console.log("1. Restart the backend server");
console.log("2. Try uploading a 3D model file");
console.log("3. Check if file appears in uploads/3d_models/");
console.log("4. Verify file is accessible via HTTP");
