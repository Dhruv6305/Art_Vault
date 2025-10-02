const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

console.log("🧪 Testing Complete Upload Flow");
console.log("===============================");

// Step 1: Check backend server
const testServer = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/artworks/test");
    console.log("✅ Backend server is running");
    return true;
  } catch (error) {
    console.log("❌ Backend server is NOT running");
    console.log("   Please start the server with: npm start");
    return false;
  }
};

// Step 2: Check upload directories
const checkDirectories = () => {
  const uploadsDir = path.join(__dirname, "uploads");
  const threeDDir = path.join(uploadsDir, "3d_models");

  console.log("\n📁 Directory Check:");
  console.log("- uploads/ exists:", fs.existsSync(uploadsDir));
  console.log("- uploads/3d_models/ exists:", fs.existsSync(threeDDir));

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created uploads directory");
  }

  if (!fs.existsSync(threeDDir)) {
    fs.mkdirSync(threeDDir, { recursive: true });
    console.log("✅ Created 3d_models directory");
  }

  // Test write permissions
  try {
    const testFile = path.join(threeDDir, "test-write.txt");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    console.log("✅ Write permissions OK");
    return true;
  } catch (error) {
    console.log("❌ Write permissions FAILED:", error.message);
    return false;
  }
};

// Step 3: Create test 3D file
const createTestFile = () => {
  const testGLTF = {
    asset: { version: "2.0" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0 },
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

  const testFilePath = path.join(__dirname, "test-model.gltf");
  fs.writeFileSync(testFilePath, JSON.stringify(testGLTF, null, 2));
  console.log("\n📄 Created test GLTF file:", testFilePath);
  return testFilePath;
};

// Step 4: Test upload without authentication (should fail with 401)
const testUploadNoAuth = async (filePath) => {
  try {
    const form = new FormData();
    form.append("files", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://localhost:5000/api/artworks/upload",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    console.log("❌ Upload without auth should have failed but didn't");
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("✅ Upload correctly rejected without authentication (401)");
      return true;
    } else {
      console.log("❌ Unexpected error:", error.message);
      return false;
    }
  }
};

// Step 5: Test file type detection
const testFileTypeDetection = () => {
  console.log("\n🔍 File Type Detection Test:");

  const testFiles = [
    { name: "model.gltf", expected: "3d_model" },
    { name: "scene.fbx", expected: "3d_model" },
    { name: "mesh.obj", expected: "3d_model" },
    { name: "texture.jpg", expected: "image" },
    { name: "video.mp4", expected: "video" },
  ];

  testFiles.forEach((file) => {
    const ext = path.extname(file.name).toLowerCase();
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

    let detected = "document";
    if (threeDExtensions.includes(ext)) detected = "3d_model";
    else if ([".jpg", ".png", ".gif"].includes(ext)) detected = "image";
    else if ([".mp4", ".avi"].includes(ext)) detected = "video";

    const correct = detected === file.expected;
    console.log(
      `- ${file.name}: ${correct ? "✅" : "❌"} ${detected} (expected: ${
        file.expected
      })`
    );
  });
};

// Step 6: Check multer configuration
const testMulterConfig = () => {
  console.log("\n⚙️ Multer Configuration Test:");

  // Simulate multer destination function
  const getDestination = (filename, mimetype) => {
    let uploadPath = "uploads/";
    const fileExtension = path.extname(filename).toLowerCase();
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

    if (mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (mimetype.startsWith("video/")) {
      uploadPath += "videos/";
    } else if (mimetype.startsWith("audio/")) {
      uploadPath += "audio/";
    } else if (threeDExtensions.includes(fileExtension)) {
      uploadPath += "3d_models/";
    } else {
      uploadPath += "documents/";
    }

    return uploadPath;
  };

  const testCases = [
    {
      filename: "model.gltf",
      mimetype: "model/gltf+json",
      expected: "uploads/3d_models/",
    },
    {
      filename: "scene.fbx",
      mimetype: "application/octet-stream",
      expected: "uploads/3d_models/",
    },
    {
      filename: "texture.jpg",
      mimetype: "image/jpeg",
      expected: "uploads/images/",
    },
  ];

  testCases.forEach((test) => {
    const result = getDestination(test.filename, test.mimetype);
    const correct = result === test.expected;
    console.log(
      `- ${test.filename}: ${correct ? "✅" : "❌"} ${result} (expected: ${
        test.expected
      })`
    );
  });
};

// Main test function
const runTests = async () => {
  console.log("Starting upload system tests...\n");

  // Test 1: Server running
  const serverOK = await testServer();
  if (!serverOK) return;

  // Test 2: Directories
  const dirsOK = checkDirectories();
  if (!dirsOK) return;

  // Test 3: File type detection
  testFileTypeDetection();

  // Test 4: Multer config
  testMulterConfig();

  // Test 5: Create test file
  const testFile = createTestFile();

  // Test 6: Upload without auth
  console.log("\n🔐 Testing upload without authentication:");
  await testUploadNoAuth(testFile);

  // Cleanup
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
    console.log("🧹 Cleaned up test file");
  }

  console.log("\n📋 Next Steps:");
  console.log("1. Make sure you're logged in to the frontend");
  console.log("2. Try uploading a 3D file through the UI");
  console.log("3. Check backend console for detailed logs");
  console.log("4. Check if file appears in uploads/3d_models/");
  console.log("5. Use the DebugUpload component on Add Artwork page");
};

runTests().catch(console.error);
