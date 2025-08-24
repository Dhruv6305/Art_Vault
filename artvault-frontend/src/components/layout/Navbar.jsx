import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <header className="main-header">
      <div className="logo">
        <Link to="/">ArtVault</Link>
      </div>
      <nav className="main-nav">
        <ul>
          <li><Link to="/marketplace">Marketplace</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <span>Welcome, {user?.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;