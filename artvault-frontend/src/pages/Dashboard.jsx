import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handlers for Quick Actions
  const handleUploadArtwork = () => navigate("/add-artwork");
  const handleBrowseMarketplace = () => navigate("/marketplace");
  const handleViewCollections = () => navigate("/my-artworks");

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's what's happening with your account.</p>
      </div>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'var(--card-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Total Artworks</h3>
          <p style={{ color: 'var(--primary-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>0</p>
        </div>
        
        <div style={{
          background: 'var(--card-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Collections</h3>
          <p style={{ color: 'var(--secondary-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>0</p>
        </div>
        
        <div style={{
          background: 'var(--card-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Favorites</h3>
          <p style={{ color: 'var(--success-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>0</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleUploadArtwork}>🎨 Upload Artwork</button>
          <button className="btn btn-primary" onClick={handleBrowseMarketplace}>🛒 Browse Marketplace</button>
          <button className="btn btn-primary" onClick={handleViewCollections}>📁 View Collections</button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div style={{
        background: 'var(--card-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Recent Activity</h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>📊</p>
          <p>No recent activity to display.</p>
          <p style={{ fontSize: '0.875rem' }}>Start by uploading your first artwork or browsing the marketplace!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
