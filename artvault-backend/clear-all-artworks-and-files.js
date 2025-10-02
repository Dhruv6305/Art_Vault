const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Artwork = require("./models/Artwork");
require("dotenv").config();

console.log("🗑️ COMPLETE ARTWORK AND FILE CLEANUP");
console.log("====================================");
console.log("⚠️  WARNING: This will permanently delete:");
console.log("   - All artworks from database");
console.log("   - All uploaded files from uploads/ directory");
console.log("   - This action cannot be undone!");
console.log("");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const removeDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    let removedCount = 0;

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Recursively remove subdirectory
        const subCount = removeDirectory(filePath);
        removedCount += subCount;
        fs.rmdirSync(filePath);
        console.log(`📁 Removed directory: ${filePath}`);
      } else {
        // Remove file
        fs.unlinkSync(filePath);
        removedCount++;
        console.log(`🗑️ Removed file: ${filePath}`);
      }
    });

    return removedCount;
  }
  return 0;
};

const clearAllArtworksAndFiles = async () => {
  try {
    await connectDB();

    console.log("\n📊 Checking current database state...");

    // Count existing artworks
    const artworkCount = await Artwork.countDocuments();
    console.log(`Found ${artworkCount} artworks in database`);

    if (artworkCount === 0) {
      console.log("📭 No artworks found in database");
    } else {
      // Get some sample artwork info before deletion
      const sampleArtworks = await Artwork.find({})
        .limit(5)
        .select("title category files");
      console.log("\n📋 Sample artworks to be deleted:");
      sampleArtworks.forEach((artwork, index) => {
        console.log(
          `   ${index + 1}. "${artwork.title}" (${artwork.category}) - ${
            artwork.files?.length || 0
          } files`
        );
      });

      if (artworkCount > 5) {
        console.log(`   ... and ${artworkCount - 5} more artworks`);
      }
    }

    // Check uploads directory
    console.log("\n📁 Checking uploads directory...");
    const uploadsPath = path.join(__dirname, "uploads");

    if (!fs.existsSync(uploadsPath)) {
      console.log("📭 No uploads directory found");
    } else {
      const uploadDirs = fs.readdirSync(uploadsPath);
      console.log(`Found upload directories: ${uploadDirs.join(", ")}`);

      // Count files in each directory
      let totalFiles = 0;
      uploadDirs.forEach((dir) => {
        const dirPath = path.join(uploadsPath, dir);
        if (fs.statSync(dirPath).isDirectory()) {
          const files = fs.readdirSync(dirPath);
          totalFiles += files.length;
          console.log(`   ${dir}/: ${files.length} files`);
        }
      });
      console.log(`📊 Total files to be deleted: ${totalFiles}`);
    }

    // Confirmation prompt (in a real scenario, you'd want user input)
    console.log(
      "\n⚠️  FINAL WARNING: Proceeding with deletion in 3 seconds..."
    );
    console.log("   Press Ctrl+C to cancel");

    // Wait 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("\n🗑️ Starting deletion process...");

    // Step 1: Clear database
    console.log("\n1️⃣ Clearing database...");
    if (artworkCount > 0) {
      const deleteResult = await Artwork.deleteMany({});
      console.log(
        `✅ Deleted ${deleteResult.deletedCount} artworks from database`
      );
    } else {
      console.log("✅ Database already empty");
    }

    // Step 2: Clear upload files
    console.log("\n2️⃣ Clearing upload files...");
    if (fs.existsSync(uploadsPath)) {
      const uploadDirs = [
        "images",
        "videos",
        "audio",
        "3d_models",
        "documents",
        "folders",
      ];
      let totalRemovedFiles = 0;

      uploadDirs.forEach((dirName) => {
        const dirPath = path.join(uploadsPath, dirName);
        if (fs.existsSync(dirPath)) {
          console.log(`\n📁 Clearing ${dirName}/ directory...`);
          const removedCount = removeDirectory(dirPath);
          totalRemovedFiles += removedCount;

          // Recreate empty directory
          fs.mkdirSync(dirPath, { recursive: true });
          console.log(`✅ Cleared ${removedCount} files from ${dirName}/`);
          console.log(`📁 Recreated empty ${dirName}/ directory`);
        } else {
          console.log(`📁 ${dirName}/ directory doesn't exist, creating...`);
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });

      console.log(`\n✅ Total files removed: ${totalRemovedFiles}`);
    } else {
      console.log("📁 Creating uploads directory structure...");
      const uploadDirs = [
        "images",
        "videos",
        "audio",
        "3d_models",
        "documents",
        "folders",
      ];
      fs.mkdirSync(uploadsPath, { recursive: true });

      uploadDirs.forEach((dirName) => {
        const dirPath = path.join(uploadsPath, dirName);
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created ${dirName}/ directory`);
      });
    }

    // Step 3: Verification
    console.log("\n3️⃣ Verifying cleanup...");

    const finalArtworkCount = await Artwork.countDocuments();
    console.log(`📊 Artworks remaining in database: ${finalArtworkCount}`);

    const uploadDirs = [
      "images",
      "videos",
      "audio",
      "3d_models",
      "documents",
      "folders",
    ];
    uploadDirs.forEach((dirName) => {
      const dirPath = path.join(uploadsPath, dirName);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log(`📁 ${dirName}/: ${files.length} files remaining`);
      }
    });

    console.log("\n🎉 CLEANUP COMPLETE!");
    console.log("================");
    console.log("✅ All artworks removed from database");
    console.log("✅ All upload files deleted");
    console.log("✅ Upload directory structure recreated");
    console.log("✅ System ready for fresh uploads");

    console.log("\n📋 Next Steps:");
    console.log("1. Restart your backend server");
    console.log("2. Test file uploads through the frontend");
    console.log("3. Create new artworks as needed");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the cleanup
clearAllArtworksAndFiles();
