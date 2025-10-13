const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testCancelOrder() {
  console.log("🧪 Testing Cancel Order Functionality");
  console.log("=====================================");

  try {
    // First, let's try to get orders to see if there are any to cancel
    console.log("\n1. Checking for existing orders...");
    
    // You'll need to replace this with a valid JWT token from a logged-in user
    const token = "YOUR_JWT_TOKEN_HERE";
    
    const ordersResponse = await axios.get(`${API_BASE}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (ordersResponse.data.success && ordersResponse.data.orders.length > 0) {
      const orders = ordersResponse.data.orders;
      console.log(`✅ Found ${orders.length} orders`);
      
      // Find a cancellable order (confirmed or processing)
      const cancellableOrder = orders.find(order => 
        ["confirmed", "processing"].includes(order.status)
      );
      
      if (cancellableOrder) {
        console.log(`\n2. Found cancellable order: ${cancellableOrder._id}`);
        console.log(`   Status: ${cancellableOrder.status}`);
        console.log(`   Artwork: ${cancellableOrder.artwork?.title || 'N/A'}`);
        
        // Test cancel order
        console.log("\n3. Testing cancel order endpoint...");
        const cancelResponse = await axios.put(
          `${API_BASE}/orders/${cancellableOrder._id}/cancel`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (cancelResponse.data.success) {
          console.log("✅ Order cancelled successfully!");
          console.log(`   New status: ${cancelResponse.data.order.status}`);
        } else {
          console.log("❌ Cancel order failed:", cancelResponse.data.msg);
        }
      } else {
        console.log("⚠️  No cancellable orders found (need confirmed or processing status)");
      }
    } else {
      console.log("⚠️  No orders found to test cancellation");
    }

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data?.msg || error.message);
    
    if (error.response?.status === 401) {
      console.log("\n💡 Note: You need to replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token");
      console.log("   You can get this by logging in through the frontend and checking the browser's");
      console.log("   localStorage or by using the auth endpoints directly.");
    }
  }
}

// Instructions for running the test
console.log("📋 Cancel Order Test Instructions:");
console.log("1. Make sure your backend server is running on port 5000");
console.log("2. Replace 'YOUR_JWT_TOKEN_HERE' with a valid JWT token");
console.log("3. Make sure you have at least one order with 'confirmed' or 'processing' status");
console.log("4. Run: node test-cancel-order.js");
console.log("");

testCancelOrder();