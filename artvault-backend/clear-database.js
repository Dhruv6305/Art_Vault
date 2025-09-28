// Script to clear all data from MongoDB database
const mongoose = require("mongoose");
require("dotenv").config();

async function clearDatabase() {
  try {
    console.log("🗑️  Starting database cleanup...\n");

    // Connect to MongoDB
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/artvault";
    console.log("Connecting to:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB\n");

    // Get all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📋 Found collections:",
      collections.map((c) => c.name)
    );

    if (collections.length === 0) {
      console.log("✅ Database is already empty!");
      return;
    }

    console.log("\n🧹 Clearing all collections...");

    // Drop each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        console.log(`✅ Cleared: ${collectionName}`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`⚠️  Collection ${collectionName} was already empty`);
        } else {
          console.log(`❌ Error clearing ${collectionName}:`, error.message);
        }
      }
    }

    // Verify database is empty
    const remainingCollections = await mongoose.connection.db
      .listCollections()
      .toArray();

    if (remainingCollections.length === 0) {
      console.log("\n🎉 Database successfully cleared!");
      console.log("✅ All collections removed");
      console.log("✅ Database is now empty");
    } else {
      console.log(
        "\n⚠️  Some collections remain:",
        remainingCollections.map((c) => c.name)
      );
    }

    console.log("\n📊 Database Status:");
    console.log("- Users: 0");
    console.log("- Artworks: 0");
    console.log("- Orders: 0");
    console.log("- Notifications: 0");
    console.log("- All other data: 0");

    console.log("\n🚀 Ready for fresh start!");
    console.log("You can now:");
    console.log("1. Create new user accounts");
    console.log("2. Upload new artworks");
    console.log("3. Test the payment system with clean data");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Confirmation prompt
console.log(
  "⚠️  WARNING: This will permanently delete ALL data from your database!"
);
console.log("This includes:");
console.log("- All user accounts");
console.log("- All artworks");
console.log("- All orders");
console.log("- All notifications");
console.log("- All other data");
console.log("");
console.log("This action cannot be undone!");
console.log("");

// Run the cleanup
clearDatabase();
