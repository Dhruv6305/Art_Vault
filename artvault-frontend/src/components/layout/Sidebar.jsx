import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const navigationItems = [
    {
      section: "account",
      title: "Account",
      items: [
        {
          id: "profile",
          label: "Edit Profile",
          icon: "👤",
          action: "navigate",
        },
        { id: "security", label: "Security & Privacy", icon: "🔒" },
        { id: "preferences", label: "Preferences", icon: "⚙️" },
      ],
    },
    {
      section: "activity",
      title: "Activity",
      items: [
        { id: "collections", label: "My Collections", icon: "🎨" },
        { id: "purchases", label: "Purchase History", icon: "🛒" },
        { id: "favorites", label: "Favorites", icon: "❤️" },
      ],
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h2>Account</h2>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="sidebar-content">
          {/* User Info Section */}
          <div className="user-info-section">
            <div className="user-avatar">
              <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            <div className="user-details">
              <h3>{user?.name || "User"}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="sidebar-nav">
            {navigationItems.map((section) => (
              <div key={section.section} className="nav-section">
                <h4 className="nav-section-title">{section.title}</h4>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    onClick={() => {
                      if (item.action === "navigate") {
                        navigate("/profile");
                        onClose();
                      } else {
                        setActiveSection(item.id);
                      }
                    }}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}

            {/* Logout Section */}
            <div className="nav-section">
              <h4 className="nav-section-title">Actions</h4>
              <button
                className="nav-item"
                style={{ color: "var(--error-color)" }}
                onClick={handleLogout}
              >
                <span className="nav-item-icon">🚪</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="tab-content">
            {activeSection === "profile" && (
              <div className="profile-tab">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{user?.name || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <span>{user?.email || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Age</label>
                  <span>{user?.age || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Country</label>
                  <span>{user?.country || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Address</label>
                  <span>{user?.address || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Contact Info</label>
                  <span>{user?.contactInfo || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <span>
                    {user?.date
                      ? new Date(user.date).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="settings-tab">
                <button className="settings-btn">
                  <span>🔑</span>
                  Change Password
                </button>
                <button className="settings-btn">
                  <span>🛡️</span>
                  Two-Factor Authentication
                </button>
                <button className="settings-btn">
                  <span>📱</span>
                  Connected Devices
                </button>
                <button className="settings-btn">
                  <span>🔐</span>
                  Privacy Settings
                </button>
              </div>
            )}

            {activeSection === "preferences" && (
              <div className="settings-tab">
                <button className="settings-btn">
                  <span>🌙</span>
                  Theme Settings
                </button>
                <button className="settings-btn">
                  <span>🔔</span>
                  Notifications
                </button>
                <button className="settings-btn">
                  <span>🌍</span>
                  Language & Region
                </button>
                <button className="settings-btn">
                  <span>📧</span>
                  Email Preferences
                </button>
              </div>
            )}

            {activeSection === "collections" && (
              <div className="profile-tab">
                <div className="info-item">
                  <label>Total Artworks</label>
                  <span>0</span>
                </div>
                <div className="info-item">
                  <label>Collections Created</label>
                  <span>0</span>
                </div>
                <div className="info-item">
                  <label>Public Collections</label>
                  <span>0</span>
                </div>
              </div>
            )}

            {activeSection === "purchases" && (
              <div className="profile-tab">
                <div className="info-item">
                  <label>Total Purchases</label>
                  <span>0</span>
                </div>
                <div className="info-item">
                  <label>Total Spent</label>
                  <span>$0.00</span>
                </div>
                <div className="info-item">
                  <label>Last Purchase</label>
                  <span>Never</span>
                </div>
              </div>
            )}

            {activeSection === "favorites" && (
              <div className="profile-tab">
                <div className="info-item">
                  <label>Favorite Artworks</label>
                  <span>0</span>
                </div>
                <div className="info-item">
                  <label>Favorite Artists</label>
                  <span>0</span>
                </div>
                <div className="info-item">
                  <label>Wishlist Items</label>
                  <span>0</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
