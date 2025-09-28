// Simple test to check what's happening on the server
// This will help us debug the 500 error

const http = require("http");

// Test data that matches what PaymentForm sends
const testOrderData = {
  artworkId: "68d41712e41f7f98cb0cccac",
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
    transactionId: `TEST_TXN_${Date.now()}`,
    paymentMethod: "Credit Card",
    processedAt: new Date().toISOString(),
  },
  subtotal: 300.0,
  tax: 27.0,
  shipping: 10.0,
  total: 337.0,
};

console.log("🔍 Testing Server Direct Connection");
console.log("===================================");

// First test - check if server is responding
const testServerHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/artworks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log("✅ Server Health Check:", res.statusCode);
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        });
      }
    );

    req.on("error", (err) => {
      console.error("❌ Server Health Check Failed:", err.message);
      reject(err);
    });

    req.end();
  });
};

// Test order creation (this is where the 500 error occurs)
const testOrderCreation = (token) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testOrderData);

    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/orders",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log("📦 Order Creation Status:", res.statusCode);
          try {
            const responseData = JSON.parse(data);
            console.log(
              "📋 Response Data:",
              JSON.stringify(responseData, null, 2)
            );
            resolve({ status: res.statusCode, data: responseData });
          } catch (e) {
            console.log("📋 Raw Response:", data);
            resolve({ status: res.statusCode, data: data });
          }
        });
      }
    );

    req.on("error", (err) => {
      console.error("❌ Order Creation Failed:", err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

async function runTests() {
  try {
    // Test 1: Server health
    console.log("🌐 Step 1: Testing server health...");
    const healthResult = await testServerHealth();

    if (healthResult.status !== 200) {
      throw new Error(`Server not healthy: ${healthResult.status}`);
    }

    console.log("✅ Server is healthy and responding");

    // Test 2: Check if we have artworks
    if (healthResult.data.success && healthResult.data.artworks.length > 0) {
      console.log(
        `✅ Found ${healthResult.data.artworks.length} artwork(s) in database`
      );
      const artwork = healthResult.data.artworks[0];
      console.log(`📊 Test artwork: "${artwork.title}" (ID: ${artwork._id})`);
    } else {
      console.log("⚠️ No artworks found in database");
    }

    // Test 3: Try order creation without token (should get 401)
    console.log("\n🔐 Step 2: Testing order creation without auth...");
    const noAuthResult = await testOrderCreation(null);

    if (noAuthResult.status === 401) {
      console.log("✅ Authentication is working (got expected 401)");
    } else {
      console.log(`⚠️ Unexpected status without auth: ${noAuthResult.status}`);
    }

    // Test 4: We need a real token to test further
    console.log("\n🎯 Step 3: To test with authentication:");
    console.log("1. Login at http://localhost:5173");
    console.log(
      '2. Open browser console and run: localStorage.getItem("token")'
    );
    console.log("3. Copy the token and run this script with it as argument");
    console.log('   Example: node test-server-direct.js "your-token-here"');

    // If token provided as argument, test with it
    const token = process.argv[2];
    if (token) {
      console.log("\n🔑 Step 4: Testing with provided token...");
      const authResult = await testOrderCreation(token);

      if (authResult.status === 200) {
        console.log("🎉 SUCCESS! Order creation worked!");
      } else if (authResult.status === 500) {
        console.log("❌ 500 ERROR - This is the issue we need to fix");
        console.log("Server error details:", authResult.data);
      } else {
        console.log(`⚠️ Unexpected status: ${authResult.status}`);
        console.log("Response:", authResult.data);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

console.log("Test Order Data:");
console.log(JSON.stringify(testOrderData, null, 2));
console.log("\n");

runTests();
