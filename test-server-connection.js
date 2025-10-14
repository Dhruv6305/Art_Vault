const axios = require('axios');

async function testServerConnection() {
    try {
        console.log('🔍 Testing server connection...');
        
        // Test basic server endpoint
        console.log('Testing basic server endpoint...');
        const basicResponse = await axios.get('http://localhost:5000/');
        console.log('✅ Basic server response received');
        
        // Test a simple API endpoint
        console.log('Testing artworks endpoint...');
        const artworksResponse = await axios.get('http://localhost:5000/api/artworks');
        console.log('✅ Artworks endpoint working:', artworksResponse.data.success);
        
        // Test analytics endpoint
        console.log('Testing analytics endpoint...');
        const analyticsResponse = await axios.get('http://localhost:5000/api/analytics/platform');
        console.log('✅ Analytics endpoint working:', analyticsResponse.data.success);
        
        console.log('\n🎉 All server connections working!');
        
    } catch (error) {
        console.error('❌ Connection error:', error.code || error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   URL:', error.config?.url);
        }
        
        // Check if server is running
        console.log('\n🔍 Checking if server is running...');
        console.log('Make sure the backend server is running on port 5000');
        console.log('Run: npm run server (in artvault-backend directory)');
    }
}

testServerConnection();