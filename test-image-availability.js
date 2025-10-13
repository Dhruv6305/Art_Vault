const axios = require("axios");

async function testImageAvailability() {
  console.log("🖼️ Testing Image Availability");
  console.log("=============================");

  try {
    // Test the file structure endpoint
    console.log("\n1. Checking file structure...");
    const structureResponse = await axios.get("http://localhost:5000/test-files");
    
    if (structureResponse.data.success) {
      console.log("✅ File structure endpoint working");
      console.log("📁 Available files:");
      console.log(JSON.stringify(structureResponse.data.structure, null, 2));
    } else {
      console.log("❌ File structure check failed:", structureResponse.data.error);
    }

    // Test a specific image file that exists
    console.log("\n2. Testing specific image files...");
    const testFiles = [
      "/uploads/images/files-1759439189953-413901396.jpg",
      "/uploads/images/files-1759439203147-192423939.jpg",
      "/uploads/images/files-1759439203174-487921970.jpg"
    ];

    for (const filePath of testFiles) {
      try {
        const response = await axios.head(`http://localhost:5000${filePath}`);
        console.log(`✅ ${filePath} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${filePath} - Error: ${error.response?.status || error.message}`);
      }
    }

    // Test artworks API to see what file paths are in the database
    console.log("\n3. Checking artwork file paths in database...");
    try {
      const artworksResponse = await axios.get("http://localhost:5000/api/artworks", {
        headers: {
          "x-auth-token": "test-token" // This will fail auth but we can see the structure
        }
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("⚠️ Need authentication to check artwork file paths");
        console.log("💡 You can check this manually by:");
        console.log("   1. Login to your app");
        console.log("   2. Open browser console");
        console.log("   3. Run: localStorage.getItem('token')");
        console.log("   4. Use that token to test the API");
      } else {
        console.log("❌ Artworks API error:", error.response?.status, error.message);
      }
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testImageAvailability();