const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Artwork = require("./models/Artwork");
const Order = require("./models/Order");

// Import analytics controller
const {
  getPlatformInsights,
  getArtistInsights,
  getAudienceInsights,
} = require("./controllers/analyticsController");

async function testAnalyticsComplete() {
  try {
    console.log('🚀 Starting comprehensive analytics test...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Create Express app
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Add analytics routes
    app.get("/api/analytics/platform", getPlatformInsights);
    app.get("/api/analytics/artists", getArtistInsights);
    app.get("/api/analytics/audience", getAudienceInsights);
    
    // Start server
    const server = app.listen(5001, () => {
      console.log('✅ Test server started on port 5001');
    });
    
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test endpoints
    const axios = require('axios');
    
    console.log('\n📊 Testing Platform Insights...');
    try {
      const platformResponse = await axios.get('http://localhost:5001/api/analytics/platform');
      console.log('✅ Platform insights successful');
      console.log('Sample data:', {
        totalUsers: platformResponse.data.data.growth.totalUsers,
        totalArtworks: platformResponse.data.data.growth.totalArtworks,
        uploadsDataLength: platformResponse.data.data.uploads.data.length
      });
    } catch (error) {
      console.error('❌ Platform insights failed:', error.message);
    }
    
    console.log('\n🎨 Testing Artist Insights...');
    try {
      const artistResponse = await axios.get('http://localhost:5001/api/analytics/artists');
      console.log('✅ Artist insights successful');
      console.log('Sample data:', {
        topArtistsCount: artistResponse.data.data.topArtists.length,
        salesTrendDataLength: artistResponse.data.data.salesTrend.data.length
      });
    } catch (error) {
      console.error('❌ Artist insights failed:', error.message);
    }
    
    console.log('\n👥 Testing Audience Insights...');
    try {
      const audienceResponse = await axios.get('http://localhost:5001/api/analytics/audience');
      console.log('✅ Audience insights successful');
      console.log('Sample data:', {
        geographicLabelsCount: audienceResponse.data.data.geographic.labels.length,
        categoryTrendsCount: audienceResponse.data.data.categoryTrends.labels.length
      });
    } catch (error) {
      console.error('❌ Audience insights failed:', error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    
    // Close server
    server.close();
    console.log('✅ Test server closed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

testAnalyticsComplete();