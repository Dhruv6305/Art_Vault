const fs = require("fs");
const path = require("path");

// Create a simple test GLTF file
const testGLTF = {
  asset: {
    version: "2.0",
  },
  scene: 0,
  scenes: [
    {
      nodes: [0],
    },
  ],
  nodes: [
    {
      mesh: 0,
    },
  ],
  meshes: [
    {
      primitives: [
        {
          attributes: {
            POSITION: 0,
          },
        },
      ],
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: 3,
      type: "VEC3",
    },
  ],
  bufferViews: [
    {
      buffer: 0,
      byteLength: 36,
      byteOffset: 0,
    },
  ],
  buffers: [
    {
      byteLength: 36,
      uri: "data:application/octet-stream;base64,AAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAA=",
    },
  ],
};

// Create test file
const testFilePath = path.join(__dirname, "test-model.gltf");
fs.writeFileSync(testFilePath, JSON.stringify(testGLTF, null, 2));

console.log("✅ Created test GLTF file:", testFilePath);
console.log("📁 File size:", fs.statSync(testFilePath).size, "bytes");
console.log("");
console.log("🧪 To test the upload:");
console.log("1. Start the backend server");
console.log("2. Use a tool like Postman or curl to upload this file");
console.log("3. POST to http://localhost:5000/api/artworks/upload");
console.log("4. Include Authorization header with valid JWT token");
console.log("5. Upload the file as 'files' field");
console.log("");
console.log("📋 Expected behavior:");
console.log("- File should be saved to uploads/3d_models/");
console.log("- Response should include file metadata");
console.log("- File should be accessible via /uploads/3d_models/filename");

// Clean up
setTimeout(() => {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log("🧹 Cleaned up test file");
  }
}, 5000);
