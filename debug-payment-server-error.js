#!/usr/bin/env node

/**
 * 🔍 Payment Server Error Debug Script
 *
 * This script helps debug payment server errors by testing the complete flow
 */

const axios = require("axios");
const mongoose = require("mongoose");

const API_BASE = "http://localhost:5000/api";

// Test data
const TEST_USER = {
  email: "test@artvault.com",
  password: "testpassword123",
  name: "Test Artist",
};

const TEST_ARTWORK = {
  title: "Debug Test Artwork",
  description: "Test artwork for debugging payment issues",
  price: 50.0,
  quantity: 5,
  category: "digital",
  tags: ["test", "debug"],
};

async function debugPaymentError() {
  console.log("🔍 Payment Server Error Debug");
  console.log("==============================");

  let token = null;
  let userId = null;
  let artworkId = null;

  try {
    // Step 1: Check server status
    console.log("🌐 Step 1: Checking server status...");
    try {
      const healthCheck = await axios.get(`${API_BASE}/health`);
      console.log("✅ Server is responding");
    } catch (error) {
      console.log("❌ Server health check failed:", error.message);
      // Continue anyway, server might not have health endpoint
    }

    // Step 2: Try to login or register
    console.log("🔐 Step 2: Authentication...");
    try {
      // Try login first
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      if (loginResponse.data.success) {
        token = loginResponse.data.token;
        userId = loginResponse.data.user.id;
        console.log(`✅ Logged in as: ${loginResponse.data.user.name}`);
      }
    } catch (loginError) {
      console.log("⚠️ Login failed, trying registration...");

      try {
        const registerResponse = await axios.post(
          `${API_BASE}/auth/register`,
          TEST_USER
        );
        if (registerResponse.data.success) {
          token = registerResponse.data.token;
          userId = registerResponse.data.user.id;
          console.log(
            `✅ Registered and logged in as: ${registerResponse.data.user.name}`
          );
        }
      } catch (registerError) {
        console.error(
          "❌ Registration also failed:",
          registerError.response?.data || registerError.message
        );
        throw new Error("Authentication failed completely");
      }
    }

    if (!token) {
      throw new Error("No authentication token obtained");
    }

    // Step 3: Create or find artwork
    console.log("🎨 Step 3: Setting up artwork...");
    try {
      // Try to create artwork
      const artworkResponse = await axios.post(
        `${API_BASE}/artworks`,
        {
          ...TEST_ARTWORK,
          artist: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (artworkResponse.data.success) {
        artworkId = artworkResponse.data.artwork._id;
        console.log(
          `✅ Created artwork: "${artworkResponse.data.artwork.title}" (ID: ${artworkId})`
        );
      }
    } catch (artworkError) {
      console.log(
        "⚠️ Artwork creation failed, trying to find existing artwork..."
      );

      try {
        const artworksResponse = await axios.get(`${API_BASE}/artworks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (
          artworksResponse.data.success &&
          artworksResponse.data.artworks.length > 0
        ) {
          artworkId = artworksResponse.data.artworks[0]._id;
          console.log(`✅ Using existing artwork: ${artworkId}`);
        } else {
          throw new Error("No artworks available for testing");
        }
      } catch (findError) {
        console.error(
          "❌ Could not find or create artwork:",
          findError.response?.data || findError.message
        );
        throw new Error("Artwork setup failed");
      }
    }

    if (!artworkId) {
      throw new Error("No artwork ID available for testing");
    }

    // Step 4: Validate artwork ID format
    console.log("🔍 Step 4: Validating artwork ID...");
    if (!mongoose.Types.ObjectId.isValid(artworkId)) {
      console.error("❌ Invalid artwork ID format:", artworkId);
      throw new Error("Invalid artwork ID format");
    }
    console.log("✅ Artwork ID format is valid");

    // Step 5: Test payment order creation
    console.log("💳 Step 5: Testing payment order creation...");

    const orderData = {
      artworkId: artworkId,
      quantity: 1,
      shippingInfo: {
        fullName: "Debug Test Customer",
        email: "debug@test.com",
        address: "123 Debug Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "United States",
      },
      shippingMethod: "standard",
      paymentData: {
        transactionId: `DEBUG_TXN_${Date.now()}`,
        paymentMethod: "Credit Card",
        processedAt: new Date().toISOString(),
      },
      subtotal: 50.0,
      tax: 4.5,
      shipping: 5.5,
      total: 60.0,
    };

    console.log("📦 Order payload:", JSON.stringify(orderData, null, 2));

    const orderResponse = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (orderResponse.data.success) {
      console.log("✅ Payment order created successfully!");
      console.log("📦 Order ID:", orderResponse.data.order._id);
      console.log("💰 Total:", orderResponse.data.order.pricing.total);
      console.log(
        "📊 Remaining quantity:",
        orderResponse.data.remainingQuantity
      );
    } else {
      console.error("❌ Order creation failed:", orderResponse.data.msg);
    }
  } catch (error) {
    console.error("\n❌ DEBUG FAILED:", error.message);

    if (error.response) {
      console.error("📊 Response Status:", error.response.status);
      console.error(
        "📋 Response Data:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error("🔍 Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("🌐 Network Error - No response received");
      console.error("📡 Request details:", error.request);
    } else {
      console.error("⚙️ Setup Error:", error.message);
    }

    console.log("\n🔧 TROUBLESHOOTING STEPS:");
    console.log("1. Check if backend server is running on port 5000");
    console.log("2. Check server console logs for detailed error messages");
    console.log("3. Verify database connection is working");
    console.log("4. Check if all required models are registered");
    console.log("5. Verify authentication middleware is working");

    process.exit(1);
  }
}

// Additional helper function to test individual components
async function testComponents() {
  console.log("\n🧪 Testing Individual Components");
  console.log("=================================");

  // Test 1: Server connectivity
  try {
    const response = await axios.get("http://localhost:5000");
    console.log("✅ Server is reachable");
  } catch (error) {
    console.error("❌ Server is not reachable:", error.message);
  }

  // Test 2: API endpoint availability
  try {
    const response = await axios.get(`${API_BASE}/artworks`);
    console.log("✅ API endpoints are accessible");
  } catch (error) {
    console.error(
      "❌ API endpoints error:",
      error.response?.status,
      error.response?.data?.msg
    );
  }

  // Test 3: Database connection (indirect test)
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: "nonexistent@test.com",
      password: "wrongpassword",
    });
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 401) {
      console.log(
        "✅ Database connection appears to be working (got expected auth error)"
      );
    } else {
      console.error(
        "❌ Unexpected database/server error:",
        error.response?.data
      );
    }
  }
}

// Run the debug
if (require.main === module) {
  console.log("Starting payment debug process...\n");

  debugPaymentError()
    .then(() => {
      console.log("\n🎉 Debug completed successfully!");
      process.exit(0);
    })
    .catch(() => {
      console.log("\n🔍 Running additional component tests...");
      testComponents().finally(() => {
        process.exit(1);
      });
    });
}

module.exports = { debugPaymentError, testComponents };
