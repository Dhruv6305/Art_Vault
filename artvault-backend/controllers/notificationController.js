const Notification = require("../models/Notification");

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const filter = { user: req.user.id };
    if (unreadOnly === "true") {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, msg: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    await notification.markAsRead();

    res.json({ success: true, msg: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, msg: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, msg: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Access denied" });
    }

    await notification.deleteOne();

    res.json({ success: true, msg: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
