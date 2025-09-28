const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", authMiddleware, getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get("/unread-count", authMiddleware, getUnreadCount);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", authMiddleware, markAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/read-all", authMiddleware, markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
