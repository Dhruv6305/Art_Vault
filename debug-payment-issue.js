// Comprehensive payment debugging tool
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

async function debugPaymentIssue() {
  console.log("🔍 Debugging Payment System Issues...\n");

  // Test 1: Server connectivity
  console.log("1. Testing server connectivity...");
  try {
    const response = await makeRequest({
      hostname: "localhost",
      port: 5000,
      path: "/",
      method: "GET",
    });

    if (response.status === 200) {
      console.log("✅ Server is running");
    } else {
      console.log("❌ Server issue:", response.status);
      return;
    }
  } catch (error) {
    console.log("❌ Cannot connect to server:", error.message);
    return;
  }

  // Test 2: Test with invalid artwork ID (should return 400)
  console.log("\n2. Testing with invalid artwork ID...");
  const invalidOrderData = {
    artworkId: "test123", // Invalid ObjectId
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
      transactionId: "test_txn_123",
      paymentMethod: "Credit Card",
      processedAt: new Date().toISOString(),
    },
    subtotal: 100,
    tax: 10,
    shipping: 15,
    total: 125,
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
          "x-auth-token": "fake_token_for_testing", // This will fail auth, but we want to see the error
        },
      },
      invalidOrderData
    );

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status === 401) {
      console.log("✅ Authentication is working (401 as expected)");
    } else if (response.status === 400) {
      console.log("✅ Validation is working (400 for invalid artwork ID)");
    } else {
      console.log("⚠️  Unexpected response");
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  // Test 3: Test with valid ObjectId format but non-existent artwork
  console.log("\n3. Testing with valid ObjectId format...");
  const validIdOrderData = {
    ...invalidOrderData,
    artworkId: "507f1f77bcf86cd799439011", // Valid ObjectId format but doesn't exist
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
          "x-auth-token": "fake_token_for_testing",
        },
      },
      validIdOrderData
    );

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  console.log("\n📋 Debugging Summary:");
  console.log("- Server is running ✅");
  console.log("- Added better validation and logging to order controller ✅");
  console.log("- Enhanced error handling in PaymentForm ✅");

  console.log("\n🎯 Next Steps:");
  console.log(
    "1. Check the server console for detailed logs when you try payment"
  );
  console.log("2. Make sure you are logged in (valid token in localStorage)");
  console.log("3. Use a real artwork ID from your database");
  console.log("4. Check browser network tab for exact request/response");

  console.log("\n💡 Common Issues:");
  console.log(
    '- Using test artwork ID "test123" instead of real MongoDB ObjectId'
  );
  console.log("- Not logged in (no token in localStorage)");
  console.log("- Artwork doesn't exist in database");
  console.log("- Missing required fields in order data");
}

debugPaymentIssue();
