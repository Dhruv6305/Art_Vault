// Simple script to check authentication status
// Run this in browser console: localStorage.getItem('token')

console.log("🔍 Checking Authentication Status");
console.log("================================");

// Check if running in browser
if (typeof window !== "undefined" && window.localStorage) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("Token exists:", !!token);
  console.log("User data exists:", !!user);

  if (token) {
    console.log("Token preview:", token.substring(0, 20) + "...");
  }

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("User:", userData.name, "(" + userData.email + ")");
    } catch (e) {
      console.log("User data parse error");
    }
  }

  if (!token) {
    console.log("❌ Not logged in - Please login first");
    console.log("Go to: http://localhost:5173 and login");
  } else {
    console.log("✅ Logged in - Ready to test payment");
  }
} else {
  console.log("Run this in browser console, not Node.js");
}
