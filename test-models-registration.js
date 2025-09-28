// Test to verify models are properly registered
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

async function testModelsRegistration() {
  console.log("🧪 Testing Models Registration After Database Clear...\n");

  // Test with the real artwork ID from the error
  const realOrderData = {
    artworkId: "68d41712e41f7f98cb0cccac", // Real artwork ID from error log
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

  console.log("1. Testing with real artwork ID:", realOrderData.artworkId);

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
      realOrderData
    );

    console.log("\n📊 Response Details:");
    console.log("Status:", response.status);
    console.log("Message:", response.data.msg);
    console.log("Error:", response.data.error);

    if (
      response.status === 500 &&
      response.data.error?.includes("Schema hasn't been registered")
    ) {
      console.log("\n❌ MODELS NOT REGISTERED PROPERLY");
      console.log("The server needs to properly import all models.");
    } else if (response.status === 401) {
      console.log("\n✅ MODELS ARE REGISTERED!");
      console.log("Authentication error is expected with fake token.");
      console.log("The schema registration issue is resolved.");
    } else if (response.status === 404) {
      console.log("\n✅ MODELS REGISTERED, ARTWORK NOT FOUND");
      console.log("This means the artwork was cleared from database.");
    } else {
      console.log("\n🔍 Unexpected response:", response.status);
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  console.log("\n🎯 Next Steps:");
  console.log(
    "1. If models are registered: Try payment with valid authentication"
  );
  console.log("2. If artwork not found: Upload a new artwork first");
  console.log("3. If still getting schema errors: Server needs restart");
}

testModelsRegistration();
