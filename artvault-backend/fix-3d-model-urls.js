const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const fix3DModelUrls = async () => {
  try {
    await connectDB();

    console.log("Fixing 3D model URLs to use working sample models...");

    // Find all 3D model artworks
    const threeDModels = await Artwork.find({ category: "3d_model" });

    console.log(`Found ${threeDModels.length} 3D model artworks to fix`);

    // Working 3D model URLs (these are publicly available sample models)
    const workingModels = [
      {
        url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
        filename: "damaged_helmet.gltf",
        format: "gltf",
      },
      {
        url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
        filename: "box.gltf",
        format: "gltf",
      },
      {
        url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
        filename: "duck.gltf",
        format: "gltf",
      },
      {
        url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Suzanne/glTF/Suzanne.gltf",
        filename: "suzanne.gltf",
        format: "gltf",
      },
      {
        url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf",
        filename: "avocado.gltf",
        format: "gltf",
      },
    ];

    let fixedCount = 0;

    for (let i = 0; i < threeDModels.length; i++) {
      const artwork = threeDModels[i];
      const modelData = workingModels[i % workingModels.length]; // Cycle through available models

      try {
        // Update the file URL and metadata
        if (artwork.files && artwork.files.length > 0) {
          artwork.files[0].url = modelData.url;
          artwork.files[0].filename = modelData.filename;
          artwork.files[0].format = modelData.format;
          artwork.files[0].type = "3d_model";
        }

        await artwork.save();
        console.log(`✅ Fixed: ${artwork.title} -> ${modelData.filename}`);
        fixedCount++;
      } catch (error) {
        console.error(`❌ Failed to fix ${artwork.title}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully fixed ${fixedCount} 3D model URLs!`);
    console.log(`🔄 Refresh your browser to see working 3D models`);
    console.log(`📋 All models now use publicly available GLTF samples`);
  } catch (error) {
    console.error("Error fixing 3D model URLs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

fix3DModelUrls();
