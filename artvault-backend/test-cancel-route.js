// Simple test to check if cancel route is registered
const ordersRouter = require("./routes/orders");

console.log("🧪 Testing cancel route registration...");

try {
  // Check if the router has the cancel route
  let foundCancelRoute = false;
  
  ordersRouter.stack.forEach(layer => {
    if (layer.route) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods);
      
      console.log(`Route: ${methods.join(', ').toUpperCase()} ${path}`);
      
      if (path === '/:id/cancel' && methods.includes('put')) {
        foundCancelRoute = true;
        console.log("✅ Found cancel route!");
      }
    }
  });
  
  if (!foundCancelRoute) {
    console.log("❌ Cancel route not found in router stack");
  }
  
} catch (error) {
  console.error("❌ Error:", error.message);
}