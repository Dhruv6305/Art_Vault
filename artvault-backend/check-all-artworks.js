const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Get all artworks
    const artworks = await Artwork.find({});

    console.log(`Total artworks: ${artworks.length}`);

    if (artworks.length === 0) {
      console.log("No artworks found in database");
      mongoose.disconnect();
      return;
    }

    artworks.forEach((artwork, index) => {
      console.log(`\nArtwork ${index + 1}: ${artwork.title}`);
      console.log(`  Category: ${artwork.category}`);
      console.log(`  Files: ${artwork.files?.length || 0}`);

      if (artwork.files && artwork.files.length > 0) {
        artwork.files.forEach((file, fileIndex) => {
          console.log(`    File ${fileIndex + 1}:`);
          console.log(`      Filename: ${file.filename}`);
          console.log(`      Type: ${file.type}`);
          console.log(`      URL: ${file.url}`);
          if (file.format) console.log(`      Format: ${file.format}`);
        });
      }
    });

    // Check file types distribution
    const fileTypes = {};
    artworks.forEach((artwork) => {
      artwork.files?.forEach((file) => {
        fileTypes[file.type] = (fileTypes[file.type] || 0) + 1;
      });
    });

    console.log("\nFile types distribution:");
    Object.entries(fileTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
