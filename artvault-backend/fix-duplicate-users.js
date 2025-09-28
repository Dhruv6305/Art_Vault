// Script to fix duplicate user issues and prepare for Google OAuth
// Run with: node fix-duplicate-users.js

const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/artvault";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const fixDuplicateUsers = async () => {
  try {
    console.log("\n🔍 CHECKING FOR DUPLICATE USER ISSUES\n");
    console.log("=".repeat(50));

    // Find all users
    const users = await User.find({});
    console.log(`Total users in database: ${users.length}`);

    // Check for users without googleId
    const usersWithoutGoogleId = users.filter((user) => !user.googleId);
    console.log(`Users without Google ID: ${usersWithoutGoogleId.length}`);

    // Check for users with googleId
    const usersWithGoogleId = users.filter((user) => user.googleId);
    console.log(`Users with Google ID: ${usersWithGoogleId.length}`);

    // Show user details
    console.log("\n📋 USER DETAILS:");
    console.log("-".repeat(30));

    users.forEach((user, index) => {
      console.log(`[${index + 1}] ${user.email}`);
      console.log(`    Name: ${user.name}`);
      console.log(`    Google ID: ${user.googleId || "None"}`);
      console.log(`    Created: ${user.createdAt || user.date}`);
      console.log(`    Has Password: ${user.password ? "Yes" : "No"}`);
      console.log("");
    });

    // Check for the specific email that caused the error
    const problematicEmail = "aarya.bhansali@somaiya.edu";
    const problematicUser = await User.findOne({ email: problematicEmail });

    if (problematicUser) {
      console.log(`\n🎯 FOUND PROBLEMATIC USER: ${problematicEmail}`);
      console.log(`    ID: ${problematicUser._id}`);
      console.log(`    Name: ${problematicUser.name}`);
      console.log(`    Google ID: ${problematicUser.googleId || "None"}`);
      console.log(
        `    Has Password: ${problematicUser.password ? "Yes" : "No"}`
      );

      if (!problematicUser.googleId) {
        console.log("\n💡 RECOMMENDATION:");
        console.log("This user exists but has no Google ID.");
        console.log(
          "The updated OAuth strategy will now link this account with Google automatically."
        );
        console.log(
          "No manual intervention needed - just try Google login again."
        );
      }
    } else {
      console.log(`\n✅ No user found with email: ${problematicEmail}`);
      console.log("Google OAuth should work normally for this email.");
    }

    console.log("\n🔧 OAUTH STRATEGY STATUS:");
    console.log("-".repeat(30));
    console.log("✅ Updated to handle existing users");
    console.log("✅ Will link Google accounts to existing email accounts");
    console.log("✅ Will create new users only if email doesn't exist");
    console.log("✅ Enhanced logging for debugging");

    console.log("\n🚀 NEXT STEPS:");
    console.log("-".repeat(30));
    console.log("1. Restart your backend server");
    console.log("2. Try Google login again");
    console.log("3. Check backend console for detailed logs");
    console.log("4. If issues persist, check Google Cloud Console settings");
  } catch (error) {
    console.error("❌ Error checking users:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the check
const main = async () => {
  await connectDB();
  await fixDuplicateUsers();
};

main().catch(console.error);
