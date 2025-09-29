import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch artworks for counts
  useEffect(() => {
    const fetchArtworks = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await api.get(`/artworks/user/${user._id || user.id}`);
        if (response.data.success) {
          setArtworks(response.data.artworks);
        }
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [user]);

  // Handlers for Quick Actions
  const handleUploadArtwork = () => navigate("/add-artwork");
  const handleBrowseMarketplace = () => navigate("/marketplace");
  const handleViewCollections = () => navigate("/my-artworks");

  // Counts
  const totalArtworks = artworks.length;
  const collections = artworks.filter(a => a.availability === "available").length;
  const favorites = artworks.reduce((count, a) => count + (a.likes?.length || 0), 0);

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's what's happening with your account.</p>
      </div>
      
      {/* Stats Cards - UI Unchanged */}
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
          <p style={{ color: 'var(--primary-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            {loading ? "..." : totalArtworks}
          </p>
        </div>
        
        <div style={{
          background: 'var(--card-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Collections</h3>
          <p style={{ color: 'var(--secondary-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            {loading ? "..." : collections}
          </p>
        </div>
        
        <div style={{
          background: 'var(--card-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Favorites</h3>
          <p style={{ color: 'var(--success-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            {loading ? "..." : favorites}
          </p>
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
          padding: '2rem',
          color: 'var(--text-muted)'
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : totalArtworks === 0 ? (
            <>
              <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>📊</p>
              <p>No recent activity to display.</p>
              <p style={{ fontSize: '0.875rem' }}>Start by uploading your first artwork or browsing the marketplace!</p>
            </>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {artworks.slice(0, 5).map(a => (
                <li key={a._id} style={{ margin: '0.5rem 0' }}>
                  {a.title} — {a.availability}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
