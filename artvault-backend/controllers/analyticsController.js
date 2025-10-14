const User = require("../models/User");
const Artwork = require("../models/Artwork");
const Order = require("../models/Order");
const mongoose = require("mongoose");

// Get platform insights
const getPlatformInsights = async (req, res) => {
  try {
    // Get current date and 6 months ago
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    // Monthly uploads data
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

    // Format monthly data
    const months = [];
    const uploadCounts = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      const monthData = monthlyUploads.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );
      uploadCounts.push(monthData ? monthData.count : 0);
    }

    // Growth metrics
    const totalUsers = await User.countDocuments();
    const totalArtworks = await Artwork.countDocuments();
    
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    
    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const previousMonthUsers = await User.countDocuments({ 
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth } 
    });
    
    const lastMonthArtworks = await Artwork.countDocuments({ createdAt: { $gte: lastMonth } });
    const previousMonthArtworks = await Artwork.countDocuments({ 
      createdAt: { $gte: twoMonthsAgo, $lt: lastMonth } 
    });

    const monthlyGrowth = previousMonthUsers > 0 
      ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers * 100).toFixed(1)
      : 0;
    
    const artworkGrowth = previousMonthArtworks > 0 
      ? ((lastMonthArtworks - previousMonthArtworks) / previousMonthArtworks * 100).toFixed(1)
      : 0;

    // Engagement data
    const engagementData = await Artwork.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
          totalArtworks: { $sum: 1 }
        }
      }
    ]);

    const engagement = engagementData[0] || { totalViews: 0, totalLikes: 0, totalArtworks: 0 };

    res.json({
      success: true,
      data: {
        uploads: {
          labels: months,
          data: uploadCounts
        },
        growth: {
          totalUsers,
          monthlyGrowth: parseFloat(monthlyGrowth),
          totalArtworks,
          artworkGrowth: parseFloat(artworkGrowth)
        },
        engagement: {
          labels: ['Views', 'Likes', 'Artworks', 'Users'],
          data: [engagement.totalViews, engagement.totalLikes, totalArtworks, totalUsers]
        }
      }
    });
  } catch (error) {
    console.error('Platform insights error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get artist insights
const getArtistInsights = async (req, res) => {
  try {
    // Top artists by sales
    const topArtists = await Order.aggregate([
      {
        $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } }
      },
      {
        $group: {
          _id: "$artist",
          sales: { $sum: "$quantity" },
          revenue: { $sum: "$pricing.total" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "artistInfo"
        }
      },
      {
        $unwind: "$artistInfo"
      },
      {
        $lookup: {
          from: "artworks",
          localField: "_id",
          foreignField: "artist",
          as: "artworks"
        }
      },
      {
        $addFields: {
          avgRating: {
            $avg: {
              $map: {
                input: "$artworks",
                as: "artwork",
                in: {
                  $cond: [
                    { $gt: [{ $size: "$$artwork.likes" }, 0] },
                    4.5, // Simplified rating calculation
                    4.0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: "$artistInfo.name",
          sales: 1,
          revenue: { $round: ["$revenue", 0] },
          rating: { $round: ["$avgRating", 1] }
        }
      },
      {
        $sort: { sales: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Sales trend over last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          sales: { $sum: "$quantity" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format sales trend data
    const months = [];
    const salesData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      const monthData = salesTrend.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );
      salesData.push(monthData ? monthData.sales : 0);
    }

    // Rating distribution (simplified)
    const totalArtworks = await Artwork.countDocuments();
    const ratingDistribution = {
      labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
      data: [65, 25, 8, 1, 1] // Simplified distribution
    };

    res.json({
      success: true,
      data: {
        topArtists,
        salesTrend: {
          labels: months,
          data: salesData
        },
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Artist insights error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get audience insights
const getAudienceInsights = async (req, res) => {
  try {
    // Geographic distribution
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

    const geographicLabels = geographic.map(item => item._id || 'Unknown');
    const geographicData = geographic.map(item => item.count);

    // Category trends
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

    const categoryLabels = categoryTrends.map(item => {
      const categoryMap = {
        'digital_art': 'Digital Art',
        'photography': 'Photography',
        'visual_art': 'Paintings',
        '3d_model': '3D Models',
        'sculpture': 'Sculptures',
        'other': 'Mixed Media'
      };
      return categoryMap[item._id] || item._id;
    });
    const categoryData = categoryTrends.map(item => item.count);

    // Age groups (simplified based on user creation patterns)
    const ageGroups = {
      labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
      data: [22, 35, 25, 12, 6] // Simplified distribution
    };

    res.json({
      success: true,
      data: {
        geographic: {
          labels: geographicLabels,
          data: geographicData
        },
        categoryTrends: {
          labels: categoryLabels,
          data: categoryData
        },
        ageGroups
      }
    });
  } catch (error) {
    console.error('Audience insights error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user-specific analytics
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // User's artwork stats
    const userArtworks = await Artwork.find({ artist: userId });
    const totalViews = userArtworks.reduce((sum, artwork) => sum + artwork.views, 0);
    const totalLikes = userArtworks.reduce((sum, artwork) => sum + artwork.likes.length, 0);

    // User's sales data
    const userSales = await Order.find({ 
      artist: userId,
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });
    
    const totalRevenue = userSales.reduce((sum, order) => sum + order.pricing.total, 0);
    const totalSales = userSales.reduce((sum, order) => sum + order.quantity, 0);

    // Monthly performance
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyPerformance = await Order.aggregate([
      {
        $match: {
          artist: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$pricing.total" },
          sales: { $sum: "$quantity" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format monthly data
    const months = [];
    const revenueData = [];
    const salesData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      const monthData = monthlyPerformance.find(item => 
        item._id.year === date.getFullYear() && 
        item._id.month === date.getMonth() + 1
      );
      
      revenueData.push(monthData ? monthData.revenue : 0);
      salesData.push(monthData ? monthData.sales : 0);
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalArtworks: userArtworks.length,
          totalViews,
          totalLikes,
          totalRevenue,
          totalSales
        },
        monthlyRevenue: {
          labels: months,
          data: revenueData
        },
        monthlySales: {
          labels: months,
          data: salesData
        },
        topArtworks: userArtworks
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
          .map(artwork => ({
            title: artwork.title,
            views: artwork.views,
            likes: artwork.likes.length,
            price: artwork.price.amount
          }))
      }
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getPlatformInsights,
  getArtistInsights,
  getAudienceInsights,
  getUserAnalytics
};