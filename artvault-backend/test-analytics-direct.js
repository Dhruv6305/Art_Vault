// Test analytics functions directly without HTTP
const mongoose = require('mongoose');
require('dotenv').config();

// Import analytics controller
const {
  getPlatformInsights,
  getArtistInsights,
  getAudienceInsights,
} = require('./controllers/analyticsController');

async function testAnalyticsDirect() {
    try {
        console.log('🧪 Testing Analytics Functions Directly...');
        
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Mock request and response objects
        const mockReq = {};
        const mockRes = {
            json: (data) => {
                console.log('Response:', JSON.stringify(data, null, 2));
                return data;
            },
            status: (code) => ({
                json: (data) => {
                    console.log(`Status ${code}:`, JSON.stringify(data, null, 2));
                    return data;
                }
            })
        };
        
        console.log('\n📊 Testing Platform Insights...');
        await getPlatformInsights(mockReq, mockRes);
        
        console.log('\n🎨 Testing Artist Insights...');
        await getArtistInsights(mockReq, mockRes);
        
        console.log('\n👥 Testing Audience Insights...');
        await getAudienceInsights(mockReq, mockRes);
        
        console.log('\n🎉 All analytics functions working directly!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
}

testAnalyticsDirect();