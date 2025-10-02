const mongoose = require("mongoose");

// Try different database names and connections
const possibleConnections = [
  "mongodb://localhost:27017/artvault",
  "mongodb://localhost:27017/art_vault",
  "mongodb://localhost:27017/ArtVault",
  "mongodb://127.0.0.1:27017/artvault",
  "mongodb://127.0.0.1:27017/art_vault",
];

async function checkDatabase(connectionString) {
  try {
    console.log(`\n=== Checking: ${connectionString} ===`);

    await mongoose.connect(connectionString);
    console.log("✅ Connected successfully");

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections found:",
      collections.map((c) => c.name)
    );

    // Try to find artworks
    const Artwork = require("./models/Artwork");
    const artworks = await Artwork.find({}).limit(5);
    console.log(`Artworks found: ${artworks.length}`);

    if (artworks.length > 0) {
      console.log("Sample artwork:", {
        title: artworks[0].title,
        category: artworks[0].category,
        filesCount: artworks[0].files?.length || 0,
      });
    }

    await mongoose.disconnect();
    return artworks.length;
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    return 0;
  }
}

async function main() {
  console.log("🔍 Debugging database connections...\n");

  for (const connection of possibleConnections) {
    const count = await checkDatabase(connection);
    if (count > 0) {
      console.log(`\n🎉 Found ${count} artworks in: ${connection}`);
      break;
    }
  }

  console.log("\n✅ Database check complete");
  process.exit(0);
}

main().catch(console.error);
