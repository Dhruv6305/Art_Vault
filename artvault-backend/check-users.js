const mongoose = require("mongoose");
const User = require("./models/User");

// Connect to MongoDB
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    checkUsers();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function checkUsers() {
  try {
    console.log("\n👥 Checking existing users...");

    const users = await User.find({}).select("name email createdAt");

    console.log(`\nFound ${users.length} users:`);

    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   ID: ${user._id}`);
    });

    if (users.length > 0) {
      console.log("\n💡 You can use any of these existing users for testing.");
      console.log(
        "   Just log in through the frontend with their credentials."
      );
    } else {
      console.log(
        "\n💡 No users found. You need to register a new user first."
      );
    }
  } catch (error) {
    console.error("❌ Error checking users:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}
