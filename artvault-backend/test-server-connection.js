const http = require("http");

console.log("🔍 Testing Server Connection");
console.log("============================");

// Test 1: Check if server is running
const testServerRunning = () => {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/",
        method: "GET",
      },
      (res) => {
        console.log("✅ Server is running on port 5000");
        console.log("- Status:", res.statusCode);
        resolve(true);
      }
    );

    req.on("error", (err) => {
      console.log("❌ Server is NOT running on port 5000");
      console.log("- Error:", err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log("❌ Server connection timeout");
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Test 2: Check upload endpoint
const testUploadEndpoint = () => {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/artworks/upload",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        console.log("✅ Upload endpoint is accessible");
        console.log("- Status:", res.statusCode);
        console.log("- Expected: 401 (Unauthorized) or 400 (Bad Request)");
        resolve(true);
      }
    );

    req.on("error", (err) => {
      console.log("❌ Upload endpoint is NOT accessible");
      console.log("- Error:", err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log("❌ Upload endpoint timeout");
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Test 3: Check CORS
const testCORS = () => {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/artworks/test",
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
        },
      },
      (res) => {
        console.log("✅ CORS preflight working");
        console.log("- Status:", res.statusCode);
        resolve(true);
      }
    );

    req.on("error", (err) => {
      console.log("❌ CORS issue detected");
      console.log("- Error:", err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log("❌ CORS test timeout");
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Run tests
const runTests = async () => {
  console.log("\n1. Testing server connection...");
  const serverRunning = await testServerRunning();

  if (serverRunning) {
    console.log("\n2. Testing upload endpoint...");
    await testUploadEndpoint();

    console.log("\n3. Testing CORS...");
    await testCORS();
  }

  console.log("\n📋 Troubleshooting Steps:");
  console.log(
    "1. Make sure backend server is running: npm start or node server.js"
  );
  console.log("2. Check server console for any startup errors");
  console.log("3. Verify port 5000 is not blocked by firewall");
  console.log("4. Check if frontend is running on port 5173");
  console.log("5. Open browser dev tools and check Network tab during upload");
  console.log("6. Look for authentication errors (401) or CORS errors");
};

runTests();
