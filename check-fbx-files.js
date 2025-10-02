const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");

mongoose
  .connect("mongodb://localhost:27017/artvault", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Find artworks with FBX files
    const artworks = await Artwork.find({
      "files.filename": { $regex: /\.fbx$/i },
    });

    console.log("Artworks with FBX files:", artworks.length);

    artworks.forEach((artwork, index) => {
      console.log(`\nArtwork ${index + 1}: ${artwork.title}`);
      artwork.files.forEach((file, fileIndex) => {
        if (file.filename.toLowerCase().endsWith(".fbx")) {
          console.log(`  FBX File ${fileIndex + 1}:`);
          console.log(`    Filename: ${file.filename}`);
          console.log(`    Type: ${file.type}`);
          console.log(`    URL: ${file.url}`);
          console.log(`    Format: ${file.format}`);
        }
      });
    });

    // Also check all 3D model files
    const threeDModels = await Artwork.find({
      "files.type": "3d_model",
    });

    console.log(`\n3D Model artworks: ${threeDModels.length}`);

    threeDModels.forEach((artwork, index) => {
      console.log(`\nArtwork ${index + 1}: ${artwork.title}`);
      artwork.files.forEach((file, fileIndex) => {
        if (file.type === "3d_model") {
          console.log(`  3D File ${fileIndex + 1}:`);
          console.log(`    Filename: ${file.filename}`);
          console.log(`    Type: ${file.type}`);
          console.log(`    Format: ${file.format}`);
        }
      });
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
