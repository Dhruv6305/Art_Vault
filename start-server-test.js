// Test server startup
console.log('Starting server test...');

try {
    // Test if we can require the analytics controller
    const analyticsController = require('./artvault-backend/controllers/analyticsController.js');
    console.log('✅ Analytics controller loaded successfully');
    console.log('Available methods:', Object.keys(analyticsController));
    
    // Test if we can require the analytics routes
    const analyticsRoutes = require('./artvault-backend/routes/analytics.js');
    console.log('✅ Analytics routes loaded successfully');
    
    console.log('🎉 All modules loaded successfully!');
    
} catch (error) {
    console.error('❌ Error loading modules:', error.message);
    console.error(error.stack);
}