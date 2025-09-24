// Diagnose the 500 error by testing each step of the order creation process

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://aaryabhansalidab:Aarya%40123@cluster0.ixqhm.mongodb.net/art_vault?retryWrites=true&w=majority"
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// Import models
const User = require("./artvault-backend/models/User");
const Artwork = require("./artvault-backend/models/Artwork");
const Order = require("./artvault-backend/models/Order");
const Notification = require("./artvault-backend/models/Notification");

async function diagnoseOrderCreation() {
  console.log("🔍 Diagnosing Order Creation Process");
  console.log("====================================");

  await connectDB();

  try {
    // Step 1: Check if models are working
    console.log("\n📋 Step 1: Testing Model Registration...");

    try {
      const userCount = await User.countDocuments();
      console.log(`✅ User model working - ${userCount} users found`);
    } catch (error) {
      console.error("❌ User model error:", error.message);
    }

    try {
      const artworkCount = await Artwork.countDocuments();
      console.log(`✅ Artwork model working - ${artworkCount} artworks found`);
    } catch (error) {
      console.error("❌ Artwork model error:", error.message);
    }

    try {
      const orderCount = await Order.countDocuments();
      console.log(`✅ Order model working - ${orderCount} orders found`);
    } catch (error) {
      console.error("❌ Order model error:", error.message);
    }

    try {
      const notificationCount = await Notification.countDocuments();
      console.log(
        `✅ Notification model working - ${notificationCount} notifications found`
      );
    } catch (error) {
      console.error("❌ Notification model error:", error.message);
    }

    // Step 2: Test artwork lookup
    console.log("\n🎨 Step 2: Testing Artwork Lookup...");
    const artworkId = "68d41712e41f7f98cb0cccac";

    try {
      const artwork = await Artwork.findById(artworkId).populate("artist");
      if (artwork) {
        console.log(
          `✅ Artwork found: "${artwork.title}" by ${
            artwork.artist?.name || "Unknown Artist"
          }`
        );
        console.log(`📊 Quantity available: ${artwork.quantity}`);
        console.log(`👤 Artist ID: ${artwork.artist?._id || "No artist"}`);
      } else {
        console.error("❌ Artwork not found");
      }
    } catch (error) {
      console.error("❌ Artwork lookup error:", error.message);
    }

    // Step 3: Test user lookup (we need a real user ID)
    console.log("\n👤 Step 3: Testing User Lookup...");
    try {
      const users = await User.find().limit(1);
      if (users.length > 0) {
        const user = users[0];
        console.log(`✅ User found: ${user.name} (${user.email})`);
        console.log(`🆔 User ID: ${user._id}`);

        // Step 4: Test order creation with real data
        console.log("\n📦 Step 4: Testing Order Creation...");

        const testOrderData = {
          buyer: user._id,
          artist: "68d416dde41f7f98cb0ccc56", // From the artwork data we saw earlier
          artwork: artworkId,
          quantity: 1,
          shippingInfo: {
            fullName: "Test Customer",
            email: "test@example.com",
            address: "123 Test Street",
            city: "Test City",
            state: "Test State",
            zipCode: "12345",
            country: "United States",
          },
          shippingMethod: "standard",
          paymentData: {
            transactionId: `TEST_${Date.now()}`,
            paymentMethod: "Credit Card",
            processedAt: new Date(),
          },
          pricing: {
            subtotal: 300.0,
            tax: 27.0,
            shipping: 10.0,
            total: 337.0,
          },
          status: "confirmed",
        };

        console.log(
          "📋 Test order data:",
          JSON.stringify(testOrderData, null, 2)
        );

        try {
          const testOrder = new Order(testOrderData);
          await testOrder.validate(); // Just validate, don't save
          console.log("✅ Order validation passed");

          // Test notification creation
          const testNotification = new Notification({
            user: testOrderData.artist,
            type: "sale",
            title: "Test Sale",
            message: "Test message",
            data: {
              orderId: new mongoose.Types.ObjectId(),
              artworkId: artworkId,
              quantity: 1,
              total: 337.0,
              buyerName: "Test Customer",
            },
          });

          await testNotification.validate();
          console.log("✅ Notification validation passed");
        } catch (validationError) {
          console.error(
            "❌ Order/Notification validation failed:",
            validationError.message
          );
          console.error("📋 Validation details:", validationError.errors);
        }
      } else {
        console.error("❌ No users found in database");
      }
    } catch (error) {
      console.error("❌ User lookup error:", error.message);
    }

    console.log("\n🎯 Diagnosis Complete");
  } catch (error) {
    console.error("❌ Diagnosis failed:", error.message);
    console.error("📋 Error stack:", error.stack);
  } finally {
    mongoose.connection.close();
  }
}

diagnoseOrderCreation();
