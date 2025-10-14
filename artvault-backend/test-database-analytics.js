const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Order = require('./models/Order');

async function testDatabaseAnalytics() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Test basic counts
        const userCount = await User.countDocuments();
        const artworkCount = await Artwork.countDocuments();
        const orderCount = await Order.countDocuments();
        
        console.log('\n📊 Database Statistics:');
        console.log(`Users: ${userCount}`);
        console.log(`Artworks: ${artworkCount}`);
        console.log(`Orders: ${orderCount}`);
        
        // Test analytics queries
        console.log('\n🔍 Testing Analytics Queries...');
        
        // Test monthly uploads
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        
        const monthlyUploads = await Artwork.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        
        console.log('Monthly uploads data:', monthlyUploads);
        
        // Test category distribution
        const categoryTrends = await Artwork.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        console.log('Category trends:', categoryTrends);
        
        // Test geographic distribution
        const geographic = await User.aggregate([
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 6
            }
        ]);
        
        console.log('Geographic distribution:', geographic);
        
        console.log('\n🎉 All database analytics queries working!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
}

testDatabaseAnalytics();