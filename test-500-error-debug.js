// Debug the 500 error with detailed logging
const http = require("http");

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            data: parsedBody,
            headers: res.headers,
            rawBody: body,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
            headers: res.headers,
            rawBody: body,
          });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function debug500Error() {
  console.log("🔍 Debugging 500 Internal Server Error...\n");

  // Test 1: Basic server health
  console.log("1. Testing server health...");
  try {
    const response = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/",
      method: "GET",
    });

    if (response.status === 200) {
      console.log("✅ Server is responding");
    } else {
      console.log("❌ Server health issue:", response.status);
      return;
    }
  } catch (error) {
    console.log("❌ Cannot connect to server:", error.message);
    return;
  }

  // Test 2: Test with the exact data that's causing 500 error
  console.log("\n2. Testing with problematic data...");

  // This simulates the exact request from the frontend
  const problemData = {
    artworkId: "test123", // This is the invalid ID
    quantity: 1,
    shippingInfo: {
      fullName: "Test User",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zipCode: "12345",
      country: "Test Country",
      email: "test@example.com",
    },
    shippingMethod: "standard",
    paymentData: {
      transactionId: "TXN123456789",
      paymentMethod: "Credit Card",
      processedAt: new Date().toISOString(),
    },
    subtotal: 100,
    tax: 10,
    shipping: 15,
    total: 125,
  };

  try {
    console.log("Sending request with data:", {
      artworkId: problemData.artworkId,
      hasShippingInfo: !!problemData.shippingInfo,
      hasPaymentData: !!problemData.paymentData,
    });

    const response = await makeRequest(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/orders",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": "fake_token", // This will cause auth error, but let's see what happens
        },
      },
      problemData
    );

    console.log("\n📊 Response Details:");
    console.log("Status:", response.status);
    console.log("Data:", response.data);

    if (response.status === 500) {
      console.log("\n❌ 500 ERROR CONFIRMED");
      console.log("Error message:", response.data.msg);
      console.log("Error details:", response.data.error);
    } else if (response.status === 401) {
      console.log("\n🔐 Authentication error (expected with fake token)");
    } else if (response.status === 400) {
      console.log("\n✅ Validation working (400 for invalid artwork ID)");
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  // Test 3: Test with valid ObjectId but fake token
  console.log("\n3. Testing with valid ObjectId format...");

  const validIdData = {
    ...problemData,
    artworkId: "507f1f77bcf86cd799439011", // Valid ObjectId format
  };

  try {
    const response = await makeRequest(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/orders",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": "fake_token",
        },
      },
      validIdData
    );

    console.log("\nValid ObjectId test:");
    console.log("Status:", response.status);
    console.log("Message:", response.data.msg);
  } catch (error) {
    console.log("❌ Valid ObjectId test failed:", error.message);
  }

  console.log("\n🎯 Debugging Summary:");
  console.log("- Check server console for detailed error logs");
  console.log('- Look for "Create order error:" messages');
  console.log("- The 500 error should now include more details");
}

debug500Error();
