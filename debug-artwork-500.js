const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test data for artwork creation
const testArtworkData = {
  title: "Test 3D Artwork",
  description: "A test 3D model artwork",
  category: "3d_models",
  subcategory: "sculptures",
  artworkType: "3d_model",
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
  },
  quantity: 1,
  tags: "test,3d,model",
  yearCreated: 2024,
  style: "Modern",
  technique: "3D Modeling",
  location: "Digital",
  shipping: {
    available: true,
    cost: 10,
    estimatedDays: 7,
  },
  availability: "available",
  files: [],
};

async function testArtworkCreation() {
  console.log("🧪 Testing Artwork Creation...\n");

  try {
    // First, let's test if we can reach the server
    console.log("1. Testing server connection...");
    const healthCheck = await axios
      .get(`${API_BASE}/artworks`)
      .catch(() => null);

    if (!healthCheck) {
      console.log("❌ Server not responding at", API_BASE);
      console.log("   Make sure the backend server is running on port 5000");
      return;
    }
    console.log("✅ Server is responding\n");

    // Test without authentication first
    console.log("2. Testing artwork creation without auth...");
    try {
      const response = await axios.post(
        `${API_BASE}/artworks`,
        testArtworkData
      );
      console.log("✅ Artwork created successfully:", response.data);
    } catch (error) {
      console.log("❌ Error creating artwork:");
      console.log("   Status:", error.response?.status);
      console.log("   Message:", error.response?.data?.msg || error.message);
      console.log("   Full error:", error.response?.data);

      if (error.response?.status === 401) {
        console.log("\n🔐 Authentication required. Let's test with a token...");
        await testWithAuth();
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

async function testWithAuth() {
  try {
    // Try to get a test user token
    console.log("3. Testing user authentication...");

    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    const token = loginResponse.data.token;

    console.log("✅ Login successful, got token");

    // Now test artwork creation with auth
    console.log("4. Testing artwork creation with auth...");
    const response = await axios.post(`${API_BASE}/artworks`, testArtworkData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Artwork created successfully with auth:", response.data);
  } catch (error) {
    console.log("❌ Auth test failed:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.msg || error.message);

    if (
      error.response?.status === 404 &&
      error.response?.data?.msg === "User not found"
    ) {
      console.log("\n👤 Test user not found. Let's create one...");
      await createTestUser();
    }
  }
}

async function createTestUser() {
  try {
    console.log("5. Creating test user...");

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    console.log("✅ Test user created:", response.data);

    // Now try the artwork creation again
    await testWithAuth();
  } catch (error) {
    console.log("❌ Failed to create test user:");
    console.log("   Status:", error.response?.status);
    console.log("   Message:", error.response?.data?.msg || error.message);
  }
}

// Run the test
testArtworkCreation();
