const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

console.log("🔍 Finding FBX Files in Database");
console.log("===============================");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const findFBXFiles = async () => {
  try {
    await connectDB();

    console.log("🔍 Searching for FBX files...");

    // Find all artworks with FBX files
    const fbxArtworks = await Artwork.find({
      $or: [
        { "files.filename": { $regex: /\.fbx$/i } },
        { "files.url": { $regex: /\.fbx$/i } },
        { "files.format": "fbx" },
      ],
    }).select("title artistName files category createdAt");

    console.log(`\nFound ${fbxArtworks.length} artworks with FBX files:`);

    if (fbxArtworks.length === 0) {
      console.log("📭 No FBX files found in database");
    } else {
      fbxArtworks.forEach((artwork, index) => {
        console.log(`\n🎨 Artwork ${index + 1}: "${artwork.title}"`);
        console.log(`   Artist: ${artwork.artistName}`);
        console.log(`   Category: ${artwork.category}`);
        console.log(`   Created: ${artwork.createdAt?.toLocaleDateString()}`);
        console.log(`   Files: ${artwork.files.length}`);

        artwork.files.forEach((file, fileIndex) => {
          if (
            file.filename?.toLowerCase().includes(".fbx") ||
            file.url?.toLowerCase().includes(".fbx") ||
            file.format === "fbx"
          ) {
            console.log(`\n   📁 FBX File ${fileIndex + 1}:`);
            console.log(`      Filename: ${file.filename}`);
            console.log(`      Format: ${file.format}`);
            console.log(`      Type: ${file.type}`);
            console.log(
              `      Size: ${
                file.size ? (file.size / 1024).toFixed(2) + " KB" : "Unknown"
              }`
            );

            // Construct full URL
            let fullUrl = file.url;
            if (file.url && !file.url.startsWith("http")) {
              fullUrl = `http://localhost:5000/${file.url}`;
            }

            console.log(`      URL: ${fullUrl}`);
            console.log(
              `      Local Path: ${file.localPath || "Not specified"}`
            );

            // For debugging
            console.log(`\n   🔧 Debug Commands:`);
            console.log(`      Test URL: ${fullUrl}`);
            console.log(`      Filename for debugger: ${file.filename}`);
          }
        });
      });

      console.log(`\n📋 Summary:`);
      console.log(`   Total FBX artworks: ${fbxArtworks.length}`);

      let totalFBXFiles = 0;
      fbxArtworks.forEach((artwork) => {
        artwork.files.forEach((file) => {
          if (
            file.filename?.toLowerCase().includes(".fbx") ||
            file.url?.toLowerCase().includes(".fbx") ||
            file.format === "fbx"
          ) {
            totalFBXFiles++;
          }
        });
      });

      console.log(`   Total FBX files: ${totalFBXFiles}`);
    }

    // Also check for any 3D model category artworks
    console.log(`\n🎲 All 3D Model Artworks:`);
    const threeDModels = await Artwork.find({ category: "3d_model" })
      .select("title artistName files")
      .sort({ createdAt: -1 });

    threeDModels.forEach((artwork, index) => {
      console.log(
        `\n   ${index + 1}. "${artwork.title}" by ${artwork.artistName}`
      );
      artwork.files.forEach((file, fileIndex) => {
        console.log(
          `      File ${fileIndex + 1}: ${file.filename} (${
            file.format || file.type
          })`
        );

        let fullUrl = file.url;
        if (file.url && !file.url.startsWith("http")) {
          fullUrl = `http://localhost:5000/${file.url}`;
        }
        console.log(`      URL: ${fullUrl}`);
      });
    });
  } catch (error) {
    console.error("❌ Error finding FBX files:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the search
findFBXFiles();
