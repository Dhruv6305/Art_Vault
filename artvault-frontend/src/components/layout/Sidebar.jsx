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
      title: "My Account",
      items: [
        {
          id: "profile",
          label: "Edit Profile",
          icon: "👤",
          action: "navigate",
        },
        {
          id: "dashboard",
          label: "My Dashboard",
          icon: "🚀",
          action: "navigate",
          path: "dashboard"
        },
        { id: "security", label: "Security & Privacy", icon: "🔒" },
        { id: "preferences", label: "Preferences", icon: "⚙️" },
      ],
    },
    {
      section: "artwork",
      title: "Artwork",
      items: [
        {
          id: "add-artwork",
          label: "Add New Artwork",
          icon: "➕",
          action: "navigate",
          path: "/add-artwork",
        },
        {
          id: "my-artworks",
          label: "My Artworks",
          icon: "🎨",
          action: "navigate",
          path: "/my-artworks",
        },
      ],
    },
    {
      section: "activity",
      title: "Activity",
      items: [
        { id: "collections", 
          label: "My Collections", 
          icon: "🎨",
          action: "navigate",
          path: "/my-artworks",
        },
        { id: "purchases", 
          label: "Purchase History", 
          icon: "🛒",
          action: "navigate",
          path: "/orders"
          },
        { id: "favorites", 
          label: "Favorites", 
          icon: "❤️" },
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
      <div className={`sidebar right-side ${isOpen ? "sidebar-open" : ""}`}>
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
                        navigate(item.path || "/profile");
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
                <span className="nav-item-icon">⏻</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          {/* REMOVE the tab-content and profile-tab rendering entirely so nothing is shown below sign out */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
