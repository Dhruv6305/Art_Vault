const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testCancelOrderAPI() {
  console.log("🧪 Testing Cancel Order API Endpoint");
  console.log("====================================");

  try {
    // First, let's test if the server is responding
    console.log("\n1. Testing server connection...");
    const healthCheck = await axios.get(`${API_BASE}/orders`, {
      headers: {
        "x-auth-token": "test-token", // This will fail auth but should reach the endpoint
      },
    }).catch(err => err.response);

    if (healthCheck) {
      console.log(`✅ Server responding with status: ${healthCheck.status}`);
      if (healthCheck.status === 401) {
        console.log("✅ Auth middleware is working (401 Unauthorized as expected)");
      }
    }

    // Test the cancel endpoint structure
    console.log("\n2. Testing cancel endpoint structure...");
    const cancelTest = await axios.put(`${API_BASE}/orders/test-id/cancel`, {}, {
      headers: {
        "x-auth-token": "test-token",
      },
    }).catch(err => err.response);

    if (cancelTest) {
      console.log(`📋 Cancel endpoint responding with status: ${cancelTest.status}`);
      console.log(`📋 Response:`, cancelTest.data);
      
      if (cancelTest.status === 401) {
        console.log("✅ Cancel endpoint exists and auth is required");
      } else if (cancelTest.status === 404) {
        console.log("❌ Cancel endpoint not found - route may not be registered");
      } else if (cancelTest.status === 500) {
        console.log("⚠️  Server error - check backend logs");
      }
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log("\n💡 Server is not running. Please start the backend server:");
      console.log("   cd artvault-backend && npm start");
    }
  }
}

testCancelOrderAPI();