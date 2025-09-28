#!/usr/bin/env node

/**
 * 🚀 ArtVault Test Data Setup Script
 *
 * This script helps you quickly set up test data after database clear.
 * Run this after creating a user account through the frontend.
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const API_BASE = "http://localhost:5000/api";

// Test user credentials (you'll need to register this user first)
const TEST_USER = {
  email: "test@artvault.com",
  password: "testpassword123",
  name: "Test Artist",
};

// Test artwork data
const TEST_ARTWORK = {
  title: "Digital Masterpiece",
  description: "A beautiful digital artwork for testing the payment system",
  price: 99.99,
  quantity: 10,
  category: "digital",
  tags: ["digital", "art", "test", "colorful"],
};

async function setupTestData() {
  console.log("🎨 ArtVault Test Data Setup");
  console.log("============================");

  try {
    // Step 1: Login to get auth token
    console.log("🔐 Step 1: Logging in...");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    if (!loginResponse.data.success) {
      throw new Error("Login failed: " + loginResponse.data.msg);
    }

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as: ${user.name} (${user.email})`);

    // Step 2: Create test artwork
    console.log("🎨 Step 2: Creating test artwork...");

    const artworkResponse = await axios.post(
      `${API_BASE}/artworks`,
      {
        ...TEST_ARTWORK,
        artist: user.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!artworkResponse.data.success) {
      throw new Error("Artwork creation failed: " + artworkResponse.data.msg);
    }

    const artwork = artworkResponse.data.artwork;
    console.log(`✅ Created artwork: "${artwork.title}" (ID: ${artwork._id})`);

    // Step 3: Test payment system
    console.log("💳 Step 3: Testing payment system...");

    const orderData = {
      artworkId: artwork._id,
      quantity: 1,
      shippingInfo: {
        fullName: "Test Customer",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country",
      },
      paymentData: {
        cardNumber: "4111111111111111",
        expiryDate: "12/25",
        cvv: "123",
        cardholderName: "Test Customer",
      },
    };

    const paymentResponse = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!paymentResponse.data.success) {
      throw new Error("Payment test failed: " + paymentResponse.data.msg);
    }

    const order = paymentResponse.data.order;
    console.log(`✅ Payment test successful! Order ID: ${order._id}`);

    // Success summary
    console.log("\n🎉 Setup Complete!");
    console.log("==================");
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🎨 Artwork: "${artwork.title}" - $${artwork.price}`);
    console.log(`📦 Test Order: ${order._id}`);
    console.log(`🌐 Frontend: http://localhost:5173`);
    console.log(`🔧 Backend: http://localhost:5000`);
    console.log("\n✅ Your ArtVault system is ready for testing!");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }

    console.log("\n📋 Manual Setup Instructions:");
    console.log("1. Go to http://localhost:5173");
    console.log("2. Register a new account with these credentials:");
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}`);
    console.log(`   Name: ${TEST_USER.name}`);
    console.log("3. Upload a test artwork");
    console.log("4. Test the payment system");

    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupTestData();
}

module.exports = { setupTestData, TEST_USER, TEST_ARTWORK };
