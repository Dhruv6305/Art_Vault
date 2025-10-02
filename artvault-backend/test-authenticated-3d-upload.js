const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

console.log("🎲 Testing Authenticated 3D File Upload");
console.log("=======================================");

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

const testFilePath = path.join(__dirname, "test-upload-cube.gltf");
fs.writeFileSync(testFilePath, JSON.stringify(testGLTF, null, 2));

console.log("📄 Created test GLTF file:", testFilePath);

async function testAuthenticatedUpload() {
  try {
    console.log("\n🔐 Step 1: Testing authentication...");

    // First, let's create a test user and get a token
    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword123",
    };

    let authToken = null;

    try {
      // Try to register a test user
      console.log("📝 Attempting to register test user...");
      const registerResponse = await axios.post(
        "http://localhost:5000/api/auth/register",
        testUser
      );

      if (registerResponse.data.success) {
        authToken = registerResponse.data.token;
        console.log("✅ Test user registered successfully");
      }
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.msg?.includes("already exists")
      ) {
        console.log("👤 Test user already exists, trying to login...");

        try {
          const loginResponse = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
              email: testUser.email,
              password: testUser.password,
            }
          );

          if (loginResponse.data.success) {
            authToken = loginResponse.data.token;
            console.log("✅ Test user logged in successfully");
          }
        } catch (loginError) {
          console.log(
            "❌ Login failed:",
            loginError.response?.data?.msg || loginError.message
          );
        }
      } else {
        console.log(
          "❌ Registration failed:",
          error.response?.data?.msg || error.message
        );
      }
    }

    if (!authToken) {
      console.log("❌ Could not obtain authentication token");
      return;
    }

    console.log("🔑 Authentication token obtained");

    console.log("\n📤 Step 2: Testing 3D file upload...");

    const formData = new FormData();
    formData.append("files", fs.createReadStream(testFilePath), {
      filename: "test-upload-cube.gltf",
      contentType: "model/gltf+json",
    });

    const uploadResponse = await axios.post(
      "http://localhost:5000/api/artworks/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (uploadResponse.data.success) {
      console.log("✅ 3D file upload successful!");
      console.log("📋 Upload response:");
      console.log(JSON.stringify(uploadResponse.data, null, 2));

      // Check if file was saved in the correct directory
      const uploadedFiles = uploadResponse.data.files;
      for (const file of uploadedFiles) {
        console.log(`\n📁 Checking uploaded file: ${file.filename}`);
        console.log(`   Type: ${file.type}`);
        console.log(`   URL: ${file.url}`);
        console.log(`   Local path: ${file.localPath}`);

        if (file.type === "3d_model") {
          const expectedPath = path.join(__dirname, file.localPath);
          if (fs.existsSync(expectedPath)) {
            console.log("   ✅ File exists at expected location");

            // Check if it's in the 3d_models directory
            if (file.localPath.includes("3d_models")) {
              console.log("   ✅ File saved in 3d_models directory");
            } else {
              console.log("   ❌ File NOT saved in 3d_models directory");
            }
          } else {
            console.log("   ❌ File does not exist at expected location");
          }
        }
      }
    } else {
      console.log("❌ Upload failed:", uploadResponse.data);
    }
  } catch (error) {
    console.error("❌ Test error:", error.response?.data || error.message);
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
    testAuthenticatedUpload();
  })
  .catch(() => {
    console.log("❌ Backend server is not running. Please start it first.");
    console.log("Run: npm run dev");
  });
