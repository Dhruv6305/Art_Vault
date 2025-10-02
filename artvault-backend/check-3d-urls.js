const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

const check3DUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const threeDModels = await Artwork.find({ category: "3d_model" });
    console.log(`\nFound ${threeDModels.length} 3D model artworks:\n`);

    threeDModels.forEach((artwork, i) => {
      console.log(`${i + 1}. ${artwork.title}`);
      artwork.files.forEach((file, j) => {
        console.log(`   File ${j + 1}: ${file.filename}`);
        console.log(`   URL: ${file.url}`);
        console.log(`   Type: ${file.type}`);
        console.log("");
      });
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

check3DUrls();
