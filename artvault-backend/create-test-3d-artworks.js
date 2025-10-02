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

const createTest3DArtworks = async () => {
  try {
    await connectDB();

    // Clear existing artworks for clean test
    await Artwork.deleteMany({});
    console.log("Cleared existing artworks");

    // Create test 3D artworks with embedded files
    const testArtworks = [
      {
        title: "3d2",
        description: "A detailed 3D model created in FBX format",
        artistName: "Aarya Bhansali",
        artist: new mongoose.Types.ObjectId(),
        category: "3d_model",
        subcategory: "Vehicles",
        artworkType: "digital",
        medium: "og",
        yearCreated: 2024,
        dimensions: {
          width: null,
          height: null,
          depth: null,
          unit: "cm",
        },
        price: {
          amount: 500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 11,
        tags: ["3d", "model", "fbx", "vehicle"],
        files: [
          {
            type: "3d_model",
            url: "/uploads/3d/model.fbx",
            filename: "model.fbx",
            size: 1024000,
            isPrimary: true,
            format: "fbx",
            polygons: 15420,
            materials: ["Metal", "Glass", "Plastic"],
          },
        ],
        views: 10,
        likes: [],
      },
      {
        title: "3d1",
        description: "Beautiful sculpture model in OBJ format",
        artistName: "Aarya Bhansali",
        artist: new mongoose.Types.ObjectId(),
        category: "3d_model",
        subcategory: "Sculpture",
        artworkType: "digital",
        medium: "og",
        yearCreated: 2024,
        dimensions: {
          width: null,
          height: null,
          depth: null,
          unit: "cm",
        },
        price: {
          amount: 500,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 101,
        tags: ["3d", "sculpture", "obj", "art"],
        files: [
          {
            type: "3d_model",
            url: "/uploads/3d/sculpture.obj",
            filename: "sculpture.obj",
            size: 2048000,
            isPrimary: true,
            format: "obj",
            polygons: 28750,
            materials: ["Stone", "Marble"],
          },
        ],
        views: 23,
        likes: [],
      },
      {
        title: "Character Model",
        description: "Detailed character model in GLTF format",
        artistName: "Aarya Bhansali",
        artist: new mongoose.Types.ObjectId(),
        category: "3d_model",
        subcategory: "Character",
        artworkType: "digital",
        medium: "Digital",
        yearCreated: 2024,
        dimensions: {
          width: 180,
          height: 60,
          depth: 30,
          unit: "cm",
        },
        price: {
          amount: 750,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 5,
        tags: ["3d", "character", "gltf", "game"],
        files: [
          {
            type: "3d_model",
            url: "/uploads/3d/character.gltf",
            filename: "character.gltf",
            size: 512000,
            isPrimary: true,
            format: "gltf",
            polygons: 8920,
            materials: ["Skin", "Clothing", "Hair"],
          },
        ],
        views: 45,
        likes: [],
      },
      {
        title: "Architectural Model",
        description: "Modern building design in Blender format",
        artistName: "Aarya Bhansali",
        artist: new mongoose.Types.ObjectId(),
        category: "3d_model",
        subcategory: "Architecture",
        artworkType: "digital",
        medium: "Digital",
        yearCreated: 2024,
        dimensions: {
          width: 500,
          height: 300,
          depth: 200,
          unit: "cm",
        },
        price: {
          amount: 1200,
          currency: "INR",
          negotiable: false,
        },
        availability: "available",
        quantity: 2,
        tags: ["3d", "architecture", "blend", "building"],
        files: [
          {
            type: "3d_model",
            url: "/uploads/3d/building.blend",
            filename: "building.blend",
            size: 4096000,
            isPrimary: true,
            format: "blend",
            polygons: 45600,
            materials: ["Concrete", "Glass", "Steel", "Wood"],
          },
        ],
        views: 67,
        likes: [],
      },
      {
        title: "Jewelry Design",
        description: "Intricate jewelry piece in STL format",
        artistName: "Aarya Bhansali",
        artist: new mongoose.Types.ObjectId(),
        category: "3d_model",
        subcategory: "Jewelry",
        artworkType: "digital",
        medium: "Digital",
        yearCreated: 2024,
        dimensions: {
          width: 5,
          height: 3,
          depth: 2,
          unit: "cm",
        },
        price: {
          amount: 300,
          currency: "INR",
          negotiable: true,
        },
        availability: "available",
        quantity: 25,
        tags: ["3d", "jewelry", "stl", "luxury"],
        files: [
          {
            type: "3d_model",
            url: "/uploads/3d/jewelry.stl",
            filename: "jewelry.stl",
            size: 256000,
            isPrimary: true,
            format: "stl",
            polygons: 12340,
            materials: ["Gold", "Diamond"],
          },
        ],
        views: 89,
        likes: [],
      },
    ];

    const savedArtworks = [];
    for (const artworkData of testArtworks) {
      const artwork = new Artwork(artworkData);
      const savedArtwork = await artwork.save();
      savedArtworks.push(savedArtwork);
      console.log(`Created artwork: ${savedArtwork.title}`);
    }

    console.log("\n✅ Successfully created test 3D artworks:");
    console.log(`📊 Total artworks: ${savedArtworks.length}`);

    // Display summary
    for (const artwork of savedArtworks) {
      console.log(`\n🎨 ${artwork.title}`);
      console.log(`   📂 Files: ${artwork.files.length}`);
      console.log(`   🏷️  Category: ${artwork.category}`);
      console.log(`   💰 Price: ₹${artwork.price.amount}`);
      console.log(`   📦 Quantity: ${artwork.quantity}`);
      console.log(`   🎲 Format: ${artwork.files[0]?.format?.toUpperCase()}`);
      console.log(
        `   📐 Polygons: ${artwork.files[0]?.polygons?.toLocaleString()}`
      );
    }

    console.log(
      "\n🎯 All artworks should now be visible in the frontend with 3D previews!"
    );
    console.log("🔄 Refresh your browser to see the new 3D models!");
  } catch (error) {
    console.error("Error creating test artworks:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createTest3DArtworks();
