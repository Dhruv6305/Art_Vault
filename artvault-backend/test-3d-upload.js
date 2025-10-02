const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Test the 3D file upload endpoint
async function test3DUpload() {
  try {
    console.log("🧪 Testing 3D file upload...");

    // First, let's test the basic upload endpoint without authentication
    const testResponse = await axios.get(
      "http://localhost:5000/api/artworks/test"
    );
    console.log("✅ Basic endpoint test:", testResponse.data);

    // Test with authentication (you'll need a valid token)
    // For now, let's just test the endpoint structure
    console.log("📁 Upload directories should exist:");
    console.log(
      "  - src/uploads/3d_models/",
      fs.existsSync("src/uploads/3d_models/")
    );
    console.log(
      "  - src/uploads/images/",
      fs.existsSync("src/uploads/images/")
    );
    console.log(
      "  - src/uploads/videos/",
      fs.existsSync("src/uploads/videos/")
    );
    console.log("  - src/uploads/audio/", fs.existsSync("src/uploads/audio/"));
    console.log(
      "  - src/uploads/documents/",
      fs.existsSync("src/uploads/documents/")
    );

    console.log("✅ 3D upload test completed");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

test3DUpload();
