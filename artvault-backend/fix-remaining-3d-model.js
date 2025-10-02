const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
require("dotenv").config();

const fixRemainingModel = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find the problematic model
    const carModel = await Artwork.findOne({ title: "cAR" });

    if (carModel) {
      console.log("Found problematic model:", carModel.title);
      console.log("Current URL:", carModel.files[0].url);

      // Update with a working car model
      carModel.files[0].url =
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AntiqueCamera/glTF/AntiqueCamera.gltf";
      carModel.files[0].filename = "antique_camera.gltf";
      carModel.files[0].format = "gltf";
      carModel.files[0].type = "3d_model";

      // Update the title and description to match
      carModel.title = "Antique Camera";
      carModel.description =
        "Detailed 3D model of a vintage camera with realistic textures";

      await carModel.save();

      console.log("✅ Successfully updated model:");
      console.log("   New title:", carModel.title);
      console.log("   New URL:", carModel.files[0].url);
      console.log("   New filename:", carModel.files[0].filename);
    } else {
      console.log("Model 'cAR' not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

fixRemainingModel();
