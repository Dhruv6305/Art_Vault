// Simple test to check artwork creation issue
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testArtworkCreation() {
  console.log("🧪 Testing Artwork Creation Issue...\n");

  try {
    // Test 1: Check if server is running
    console.log("1. Testing server...");
    try {
      const response = await axios.get(`${API_BASE}/artworks`);
      console.log("✅ Server is running, got response:", response.status);
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log("❌ Server is not running on port 5000");
        console.log("   Please start the backend server first");
        return;
      }
      console.log(
        "✅ Server is running (got error response which is expected)"
      );
    }

    // Test 2: Try to create a user and login
    console.log("\n2. Testing user authentication...");

    const testUser = {
      name: "Test Artist",
      email: "testartist@example.com",
      password: "password123",
    };

    let token = null;

    // Try to register user (might fail if already exists)
    try {
      const registerResponse = await axios.post(
        `${API_BASE}/auth/register`,
        testUser
      );
      console.log("✅ User registered successfully");
      token = registerResponse.data.token;
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.msg?.includes("already exists")
      ) {
        console.log("ℹ️  User already exists, trying to login...");

        // Try to login
        try {
          const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: testUser.email,
            password: testUser.password,
          });
          token = loginResponse.data.token;
          console.log("✅ Login successful");
        } catch (loginError) {
          console.log(
            "❌ Login failed:",
            loginError.response?.data?.msg || loginError.message
          );
          return;
        }
      } else {
        console.log(
          "❌ Registration failed:",
          error.response?.data?.msg || error.message
        );
        return;
      }
    }

    if (!token) {
      console.log("❌ No authentication token available");
      return;
    }

    // Test 3: Try to create artwork
    console.log("\n3. Testing artwork creation...");

    const artworkData = {
      title: "Test 3D Artwork",
      description: "A test 3D model for debugging",
      category: "3d_model",
      subcategory: "sculptures",
      artworkType: "original",
      medium: "Digital",
      dimensions: {
        width: 10,
        height: 10,
        depth: 10,
        unit: "cm",
      },
      price: {
        amount: 100,
        currency: "USD",
        negotiable: false,
      },
      quantity: 1,
      tags: "test,3d,debug",
      yearCreated: 2024,
      style: "Modern",
      technique: "3D Modeling",
      location: {
        city: "Test City",
        state: "Test State",
        country: "Test Country",
      },
      shipping: {
        available: true,
        cost: 10,
        methods: ["standard"],
      },
      files: [],
      availability: "available",
    };

    try {
      const response = await axios.post(`${API_BASE}/artworks`, artworkData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Artwork created successfully!");
      console.log("   Artwork ID:", response.data.artwork._id);
      console.log("   Title:", response.data.artwork.title);
    } catch (error) {
      console.log("❌ Artwork creation failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Message:", error.response?.data?.msg || error.message);
      console.log(
        "   Full error data:",
        JSON.stringify(error.response?.data, null, 2)
      );

      // If it's a 500 error, let's see what the server logs show
      if (error.response?.status === 500) {
        console.log("\n🔍 This is the 500 error you're experiencing!");
        console.log("   Check the server console for detailed error logs");
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

// Run the test
testArtworkCreation();
