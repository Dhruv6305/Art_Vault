const express = require("express");
const router = express.Router();
const {
  getPlatformInsights,
  getArtistInsights,
  getAudienceInsights,
  getUserAnalytics
} = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET /api/analytics/platform
// @desc    Get platform insights (admin/public analytics)
// @access  Public (can be made private if needed)
router.get("/platform", getPlatformInsights);

// @route   GET /api/analytics/artists
// @desc    Get artist insights
// @access  Public (can be made private if needed)
router.get("/artists", getArtistInsights);

// @route   GET /api/analytics/audience
// @desc    Get audience insights
// @access  Public (can be made private if needed)
router.get("/audience", getAudienceInsights);

// @route   GET /api/analytics/user
// @desc    Get user-specific analytics
// @access  Private
router.get("/user", authMiddleware, getUserAnalytics);

module.exports = router;