const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

// Use the same connection string as your server
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Database:", MONGO_URI.split("/")[3].split("?")[0]);

    // Get all artworks
    const artworks = await Artwork.find({});

    console.log(`\n📊 Total artworks: ${artworks.length}`);

    if (artworks.length === 0) {
      console.log("❌ No artworks found in Atlas database");
      mongoose.disconnect();
      return;
    }

    artworks.forEach((artwork, index) => {
      console.log(`\n🎨 Artwork ${index + 1}: "${artwork.title}"`);
      console.log(`   Category: ${artwork.category}`);
      console.log(`   Artist: ${artwork.artistName}`);
      console.log(`   Files: ${artwork.files?.length || 0}`);

      if (artwork.files && artwork.files.length > 0) {
        artwork.files.forEach((file, fileIndex) => {
          console.log(`\n   📁 File ${fileIndex + 1}:`);
          console.log(`      Filename: ${file.filename}`);
          console.log(`      Type: ${file.type}`);
          console.log(`      Format: ${file.format || "N/A"}`);
          console.log(`      URL: ${file.url}`);
          console.log(`      Size: ${file.size} bytes`);
          console.log(`      MIME: ${file.mimetype}`);

          // Check if file URL looks correct
          if (file.url) {
            const fullUrl = file.url.startsWith("http")
              ? file.url
              : `http://localhost:5000/${file.url}`;
            console.log(`      Full URL: ${fullUrl}`);

            // Check if it's a 3D file
            const extension = file.filename?.toLowerCase().split(".").pop();
            const is3D = [
              "fbx",
              "obj",
              "gltf",
              "glb",
              "stl",
              "blend",
              "dae",
              "3ds",
              "ply",
            ].includes(extension);
            console.log(`      Extension: .${extension}`);
            console.log(`      Is 3D Model: ${is3D ? "✅" : "❌"}`);
            console.log(
              `      Type Match: ${file.type === "3d_model" ? "✅" : "❌"}`
            );
          }
        });
      } else {
        console.log("   ❌ No files attached to this artwork");
      }
    });

    // Check file types distribution
    const fileTypes = {};
    const extensions = {};

    artworks.forEach((artwork) => {
      artwork.files?.forEach((file) => {
        fileTypes[file.type] = (fileTypes[file.type] || 0) + 1;

        const ext = file.filename?.toLowerCase().split(".").pop();
        if (ext) {
          extensions[ext] = (extensions[ext] || 0) + 1;
        }
      });
    });

    console.log("\n📈 File Types Distribution:");
    Object.entries(fileTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log("\n📈 File Extensions Distribution:");
    Object.entries(extensions).forEach(([ext, count]) => {
      console.log(`   .${ext}: ${count}`);
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
