// Simple test to check if frontend can fetch artworks
// Run this in browser console or as a Node.js script

const testFrontendArtworks = async () => {
  try {
    console.log("🔍 Testing artwork fetch from frontend...");

    const response = await fetch(
      "http://localhost:5000/api/artworks?availability=available&limit=8&sortBy=createdAt&sortOrder=desc"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Response received:", {
      success: data.success,
      totalArtworks: data.artworks?.length || 0,
      message: data.message,
    });

    if (data.artworks && data.artworks.length > 0) {
      console.log("\n📊 Artworks found:");
      data.artworks.forEach((artwork, index) => {
        console.log(`\n${index + 1}. ${artwork.title}`);
        console.log(`   Category: ${artwork.category}`);
        console.log(`   Files: ${artwork.files?.length || 0}`);

        if (artwork.files && artwork.files.length > 0) {
          artwork.files.forEach((file, fileIndex) => {
            console.log(
              `     File ${fileIndex + 1}: ${file.filename} (${file.type})`
            );
            if (file.format) console.log(`       Format: ${file.format}`);
          });
        }
      });

      // Check for 3D models specifically
      const threeDModels = data.artworks.filter(
        (artwork) =>
          artwork.category === "3d_model" ||
          artwork.files?.some((file) => file.type === "3d_model")
      );

      console.log(`\n🎲 3D Models found: ${threeDModels.length}`);

      if (threeDModels.length > 0) {
        console.log("✅ 3D models should be visible in the frontend!");
        console.log("🔄 If not visible, check:");
        console.log("   1. Browser console for errors");
        console.log("   2. Network tab for failed requests");
        console.log("   3. Component rendering in React DevTools");
      } else {
        console.log("❌ No 3D models found in response");
      }
    } else {
      console.log("❌ No artworks found in response");
    }
  } catch (error) {
    console.error("❌ Error testing frontend artworks:", error);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("   1. Make sure backend server is running on port 5000");
    console.log("   2. Check if CORS is properly configured");
    console.log("   3. Verify database connection");
  }
};

// Run the test
testFrontendArtworks();

console.log("\n📋 Manual Test Instructions:");
console.log("1. Open browser and go to your frontend (http://localhost:5173)");
console.log("2. Open Developer Tools (F12)");
console.log("3. Go to Console tab");
console.log("4. Paste and run this script");
console.log("5. Check the Network tab for API calls");
console.log("6. Look for any error messages in console");
