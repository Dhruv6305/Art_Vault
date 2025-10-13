const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getArtistSales,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post("/", authMiddleware, createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", authMiddleware, getUserOrders);

// @route   GET /api/orders/sales
// @desc    Get artist's sales
// @access  Private
router.get("/sales", authMiddleware, getArtistSales);

// @route   GET /api/orders/:id
// @desc    Get order details
// @access  Private
router.get("/:id", authMiddleware, getOrderDetails);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (for artists)
// @access  Private
router.put("/:id/status", authMiddleware, updateOrderStatus);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel an order (for buyers)
// @access  Private
router.put("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
