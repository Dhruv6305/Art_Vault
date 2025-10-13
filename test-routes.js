// Test to verify routes are properly loaded
const express = require("express");
const ordersRouter = require("./artvault-backend/routes/orders");

const app = express();

// Test if the routes module loads without errors
try {
  console.log("🧪 Testing routes module loading...");
  
  // Check if the router is properly exported
  console.log("Router type:", typeof ordersRouter);
  console.log("Router constructor:", ordersRouter.constructor.name);
  
  // Try to use the router
  app.use("/api/orders", ordersRouter);
  
  // Get the registered routes
  const routes = [];
  ordersRouter.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods);
      routes.push({
        path: layer.route.path,
        methods: methods
      });
    }
  });
  
  console.log("✅ Routes loaded successfully:");
  routes.forEach(route => {
    console.log(`  ${route.methods.join(', ').toUpperCase()} ${route.path}`);
  });
  
  // Check specifically for the cancel route
  const cancelRoute = routes.find(route => 
    route.path === '/:id/cancel' && route.methods.includes('put')
  );
  
  if (cancelRoute) {
    console.log("✅ Cancel route found!");
  } else {
    console.log("❌ Cancel route not found!");
  }
  
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
  console.error("Stack:", error.stack);
}