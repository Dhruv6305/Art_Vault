const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function debugCancelEndpoint() {
  console.log("🔍 Debugging Cancel Order Endpoint");
  console.log("==================================");

  try {
    // Test 1: Check if server is running
    console.log("\n1. Testing server health...");
    const healthResponse = await axios.get("http://localhost:5000/").catch(err => err.response);
    
    if (healthResponse && healthResponse.status === 200) {
      console.log("✅ Server is running");
    } else {
      console.log("❌ Server not responding");
      return;
    }

    // Test 2: Check orders endpoint (should require auth)
    console.log("\n2. Testing orders endpoint...");
    const ordersResponse = await axios.get(`${API_BASE}/orders`).catch(err => err.response);
    
    if (ordersResponse) {
      console.log(`📋 Orders endpoint status: ${ordersResponse.status}`);
      if (ordersResponse.status === 401) {
        console.log("✅ Orders endpoint exists and requires authentication");
      }
    }

    // Test 3: Check cancel endpoint with different methods
    console.log("\n3. Testing cancel endpoint with different HTTP methods...");
    
    const testMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    
    for (const method of testMethods) {
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: `${API_BASE}/orders/test123/cancel`,
          timeout: 5000
        }).catch(err => err.response);
        
        if (response) {
          console.log(`   ${method}: Status ${response.status}`);
          if (response.status === 401) {
            console.log(`   ${method}: ✅ Endpoint exists, requires auth`);
          } else if (response.status === 404) {
            console.log(`   ${method}: ❌ Endpoint not found`);
          } else {
            console.log(`   ${method}: 📋 Response: ${response.data?.msg || 'Unknown'}`);
          }
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.log(`   ${method}: ❌ Connection refused`);
        } else {
          console.log(`   ${method}: ❌ Error: ${error.message}`);
        }
      }
    }

    // Test 4: List all available routes (if possible)
    console.log("\n4. Testing route discovery...");
    const routeTestUrls = [
      '/orders',
      '/orders/sales', 
      '/orders/test123',
      '/orders/test123/status',
      '/orders/test123/cancel'
    ];

    for (const route of routeTestUrls) {
      try {
        const response = await axios.get(`${API_BASE}${route}`).catch(err => err.response);
        if (response) {
          console.log(`   GET ${route}: ${response.status} ${response.status === 401 ? '(Auth required)' : response.status === 404 ? '(Not found)' : ''}`);
        }
      } catch (error) {
        console.log(`   GET ${route}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error("❌ Debug failed:", error.message);
  }
}

console.log("🚀 Starting endpoint debug...");
console.log("Make sure your backend server is running on port 5000");
console.log("");

debugCancelEndpoint();