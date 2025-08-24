import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <header className="main-header">
        <div className="logo">
          <Link to="/">ArtVault</Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>Loading...</li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          {isAuthenticated && (
            <button onClick={toggleSidebar} className="menu-btn" title="Menu">
              ☰
            </button>
          )}
          <div className="logo">
            <Link to="/">ArtVault</Link>
          </div>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <span>Welcome, {user?.name}</span>
                </li>
                <li>
                  <button
                    onClick={handleProfileClick}
                    className="profile-btn"
                    title="Profile"
                  >
                    <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
