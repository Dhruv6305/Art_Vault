const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

console.log("🎲 Testing 3D File Upload Specifically");
console.log("=====================================");

// Create a test GLTF file
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

const testFilePath = path.join(__dirname, "test-cube.gltf");
fs.writeFileSync(testFilePath, JSON.stringify(testGLTF, null, 2));

console.log("📄 Created test GLTF file:", testFilePath);

async function testUpload() {
  try {
    // First, test without authentication
    console.log("\n🔐 Testing upload without authentication:");

    const formData = new FormData();
    formData.append("files", fs.createReadStream(testFilePath), {
      filename: "test-cube.gltf",
      contentType: "model/gltf+json",
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/artworks/upload",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      console.log("❌ Upload should have been rejected without auth");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          "✅ Upload correctly rejected without authentication (401)"
        );
      } else {
        console.log(
          "❌ Unexpected error:",
          error.response?.status,
          error.response?.data
        );
      }
    }

    // Test the test endpoint
    console.log("\n🧪 Testing 3D upload test endpoint:");

    const testFormData = new FormData();
    testFormData.append("file", fs.createReadStream(testFilePath), {
      filename: "test-cube.gltf",
      contentType: "model/gltf+json",
    });

    try {
      const testResponse = await axios.post(
        "http://localhost:5000/api/artworks/test-3d-upload",
        testFormData,
        {
          headers: {
            ...testFormData.getHeaders(),
            Authorization: "Bearer fake-token-for-test",
          },
        }
      );
      console.log("❌ Test endpoint should have rejected fake token");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Test endpoint correctly rejected fake token (401)");
      } else {
        console.log(
          "❌ Unexpected error:",
          error.response?.status,
          error.response?.data
        );
      }
    }

    // Check file type detection
    console.log("\n🔍 File Type Detection:");
    const fileExtension = path.extname("test-cube.gltf").toLowerCase();
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
      ".x3d",
      ".ma",
      ".mb",
    ];

    console.log("- File extension:", fileExtension);
    console.log(
      "- Is 3D extension:",
      threeDExtensions.includes(fileExtension) ? "✅" : "❌"
    );
    console.log("- Expected directory: uploads/3d_models/");

    // Check if 3d_models directory exists and is writable
    console.log("\n📁 Directory Check:");
    const uploadsDir = path.join(__dirname, "uploads");
    const threeDDir = path.join(uploadsDir, "3d_models");

    console.log("- uploads/ exists:", fs.existsSync(uploadsDir) ? "✅" : "❌");
    console.log(
      "- uploads/3d_models/ exists:",
      fs.existsSync(threeDDir) ? "✅" : "❌"
    );

    if (fs.existsSync(threeDDir)) {
      try {
        const testFile = path.join(threeDDir, "test-write.txt");
        fs.writeFileSync(testFile, "test");
        fs.unlinkSync(testFile);
        console.log("- Write permissions: ✅");
      } catch (error) {
        console.log("- Write permissions: ❌", error.message);
      }
    }
  } catch (error) {
    console.error("Test error:", error.message);
  } finally {
    // Clean up
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log("\n🧹 Cleaned up test file");
    }
  }
}

// Check if server is running
axios
  .get("http://localhost:5000/api/artworks/test")
  .then(() => {
    console.log("✅ Backend server is running\n");
    testUpload();
  })
  .catch(() => {
    console.log("❌ Backend server is not running. Please start it first.");
    console.log("Run: npm run dev");
  });
