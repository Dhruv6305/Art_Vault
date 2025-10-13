const axios = require("axios");

async function debugCancelIssue() {
  console.log("🔍 Debugging Cancel Order Issue");
  console.log("===============================");

  // You'll need to replace these with actual values
  const ORDER_ID = "REPLACE_WITH_ACTUAL_ORDER_ID"; // Get this from your orders page
  const AUTH_TOKEN = "REPLACE_WITH_ACTUAL_TOKEN"; // Get this from localStorage

  if (ORDER_ID === "REPLACE_WITH_ACTUAL_ORDER_ID") {
    console.log("❌ Please replace ORDER_ID with an actual order ID");
    console.log("💡 You can get this from the orders page in your browser");
    return;
  }

  if (AUTH_TOKEN === "REPLACE_WITH_ACTUAL_TOKEN") {
    console.log("❌ Please replace AUTH_TOKEN with your actual auth token");
    console.log("💡 You can get this from localStorage in your browser console:");
    console.log("   localStorage.getItem('token')");
    return;
  }

  try {
    console.log("\n🚫 Testing cancel order API...");
    console.log("Order ID:", ORDER_ID);
    console.log("Token (first 20 chars):", AUTH_TOKEN.substring(0, 20) + "...");

    const startTime = Date.now();
    
    const response = await axios.put(
      `http://localhost:5000/api/orders/${ORDER_ID}/cancel`,
      {},
      {
        headers: {
          "x-auth-token": AUTH_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("\n✅ SUCCESS!");
    console.log("Response time:", duration + "ms");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", JSON.stringify(response.data, null, 2));

  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("\n❌ ERROR!");
    console.log("Error time:", duration + "ms");
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
      console.log("Response data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log("No response received");
      console.log("Request details:", error.request);
    } else {
      console.log("Request setup error:", error.message);
    }

    if (error.code === 'ECONNABORTED') {
      console.log("🕐 Request timed out");
    }
  }
}

console.log("📋 Instructions:");
console.log("1. Replace ORDER_ID with an actual order ID from your orders page");
console.log("2. Replace AUTH_TOKEN with your auth token from localStorage");
console.log("3. Make sure your backend server is running");
console.log("4. Run: node debug-cancel-issue.js");
console.log("");

debugCancelIssue();