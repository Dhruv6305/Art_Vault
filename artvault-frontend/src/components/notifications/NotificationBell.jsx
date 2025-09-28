import React, { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await api.get("/notifications?limit=10");
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "sale":
        return "💰";
      case "purchase":
        return "🛒";
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      case "order_update":
        return "📦";
      default:
        return "🔔";
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={handleBellClick}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notif-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() =>
                    !notification.read && markAsRead(notification._id)
                  }
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                className="view-all-btn"
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to notifications page if you have one
                }}
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {showDropdown && (
        <div
          className="notification-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
