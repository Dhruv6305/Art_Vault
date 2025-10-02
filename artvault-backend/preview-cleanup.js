const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Artwork = require("./models/Artwork");
require("dotenv").config();

console.log("👀 PREVIEW CLEANUP - DRY RUN");
console.log("============================");
console.log(
  "This will show what would be deleted WITHOUT actually deleting anything"
);
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

const countFilesInDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) return 0;

  let count = 0;
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      count += countFilesInDirectory(itemPath);
    } else {
      count++;
    }
  });

  return count;
};

const listFilesInDirectory = (dirPath, maxFiles = 10) => {
  if (!fs.existsSync(dirPath)) return [];

  const files = [];
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile() && files.length < maxFiles) {
      files.push({
        name: item,
        size: (stat.size / 1024).toFixed(2) + " KB",
        modified: stat.mtime.toLocaleDateString(),
      });
    }
  });

  return files;
};

const previewCleanup = async () => {
  try {
    await connectDB();

    console.log("📊 CURRENT DATABASE STATE");
    console.log("========================");

    // Count and analyze artworks
    const artworkCount = await Artwork.countDocuments();
    console.log(`Total artworks: ${artworkCount}`);

    if (artworkCount > 0) {
      // Analyze by category
      const categories = await Artwork.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      console.log("\nArtworks by category:");
      categories.forEach((cat) => {
        console.log(`   ${cat._id || "Unknown"}: ${cat.count} artworks`);
      });

      // Analyze by artist
      const artists = await Artwork.aggregate([
        { $group: { _id: "$artistName", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      console.log("\nTop artists:");
      artists.forEach((artist) => {
        console.log(`   ${artist._id || "Unknown"}: ${artist.count} artworks`);
      });

      // Sample artworks
      const sampleArtworks = await Artwork.find({})
        .limit(10)
        .select("title category artistName files createdAt")
        .sort({ createdAt: -1 });

      console.log("\nRecent artworks (sample):");
      sampleArtworks.forEach((artwork, index) => {
        const fileCount = artwork.files?.length || 0;
        const date = artwork.createdAt?.toLocaleDateString() || "Unknown";
        console.log(
          `   ${index + 1}. "${artwork.title}" by ${
            artwork.artistName || "Unknown"
          }`
        );
        console.log(
          `      Category: ${artwork.category}, Files: ${fileCount}, Created: ${date}`
        );
      });
    }

    console.log("\n📁 CURRENT FILE SYSTEM STATE");
    console.log("============================");

    const uploadsPath = path.join(__dirname, "uploads");

    if (!fs.existsSync(uploadsPath)) {
      console.log("📭 No uploads directory found");
    } else {
      const uploadDirs = [
        "images",
        "videos",
        "audio",
        "3d_models",
        "documents",
        "folders",
      ];
      let totalFiles = 0;
      let totalSize = 0;

      uploadDirs.forEach((dirName) => {
        const dirPath = path.join(uploadsPath, dirName);
        if (fs.existsSync(dirPath)) {
          const fileCount = countFilesInDirectory(dirPath);
          totalFiles += fileCount;

          console.log(`\n📁 ${dirName}/ directory:`);
          console.log(`   Files: ${fileCount}`);

          if (fileCount > 0) {
            const sampleFiles = listFilesInDirectory(dirPath, 5);
            console.log("   Sample files:");
            sampleFiles.forEach((file) => {
              console.log(
                `     - ${file.name} (${file.size}, ${file.modified})`
              );
            });

            if (fileCount > 5) {
              console.log(`     ... and ${fileCount - 5} more files`);
            }
          }
        } else {
          console.log(`\n📁 ${dirName}/ directory: Not found`);
        }
      });

      console.log(`\n📊 Total files across all directories: ${totalFiles}`);
    }

    console.log("\n🗑️ WHAT WOULD BE DELETED");
    console.log("========================");
    console.log(
      `❌ Database: ${artworkCount} artworks would be permanently deleted`
    );

    if (fs.existsSync(uploadsPath)) {
      const uploadDirs = [
        "images",
        "videos",
        "audio",
        "3d_models",
        "documents",
        "folders",
      ];
      let totalFilesToDelete = 0;

      uploadDirs.forEach((dirName) => {
        const dirPath = path.join(uploadsPath, dirName);
        if (fs.existsSync(dirPath)) {
          const fileCount = countFilesInDirectory(dirPath);
          totalFilesToDelete += fileCount;
          console.log(`❌ ${dirName}/: ${fileCount} files would be deleted`);
        }
      });

      console.log(
        `❌ Total files: ${totalFilesToDelete} files would be permanently deleted`
      );
    }

    console.log("\n⚠️  IMPACT ASSESSMENT");
    console.log("====================");

    if (artworkCount === 0 && totalFiles === 0) {
      console.log("✅ System is already clean - no data would be lost");
    } else {
      console.log("⚠️  This operation would result in:");
      if (artworkCount > 0) {
        console.log(
          `   - Loss of ${artworkCount} artworks and all their metadata`
        );
        console.log(
          `   - Loss of artist information and artwork relationships`
        );
      }
      if (totalFilesToDelete > 0) {
        console.log(
          `   - Permanent deletion of ${totalFilesToDelete} uploaded files`
        );
        console.log(`   - Loss of all images, videos, audio, and 3D models`);
      }
      console.log("   - This action cannot be undone!");
    }

    console.log("\n📋 TO PROCEED WITH ACTUAL CLEANUP:");
    console.log("==================================");
    console.log("Run: node clear-all-artworks-and-files.js");
    console.log("");
    console.log("💡 Alternative options:");
    console.log("- Backup database before cleanup");
    console.log("- Delete only specific categories");
    console.log("- Archive files instead of deleting");
  } catch (error) {
    console.error("❌ Error during preview:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

// Run the preview
previewCleanup();
