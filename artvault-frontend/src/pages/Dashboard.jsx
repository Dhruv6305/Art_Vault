import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch artworks and analytics
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [artworksResponse, analyticsResponse] = await Promise.all([
          api.get(`/artworks/user/${user._id || user.id}`),
          api.get('/analytics/user').catch(() => ({ data: { success: false } })) // Handle case where user has no analytics
        ]);
        
        if (artworksResponse.data.success) {
          setArtworks(artworksResponse.data.artworks);
        }
        
        if (analyticsResponse.data.success) {
          setUserAnalytics(analyticsResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Handlers for Quick Actions
  const handleUploadArtwork = () => navigate("/add-artwork");
  const handleBrowseArtworks = () => navigate("/browse");
  const handleViewCollections = () => navigate("/my-artworks");

  // Counts
  const totalArtworks = artworks.length;
  const collections = artworks.filter(a => a.availability === "available").length;
  const favorites = artworks.reduce((count, a) => count + (a.likes?.length || 0), 0);

  // Simple line chart component
  const SimpleLineChart = ({ data, title, color = '#3b82f6' }) => {
    if (!data || !data.data || data.data.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <p>No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.data);
    const minValue = Math.min(...data.data);
    const range = maxValue - minValue || 1;

    return (
      <div style={{ padding: '1rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-accent)' }}>{title}</h4>
        <svg viewBox="0 0 400 200" style={{ width: '100%', height: '200px' }}>
          {data.data.map((value, index) => {
            const x = (index * 60) + 40;
            const y = 160 - ((value - minValue) / range * 120);
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="4" fill={color} />
                {index > 0 && (
                  <line
                    x1={(index - 1) * 60 + 40}
                    y1={160 - ((data.data[index - 1] - minValue) / range * 120)}
                    x2={x}
                    y2={y}
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
                <text x={x} y="185" textAnchor="middle" fontSize="12" fill="var(--text-muted)">
                  {data.labels[index]}
                </text>
                <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill={color}>
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's what's happening with your account.</p>
      </div>
      
      {/* Enhanced Stats Cards */}
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
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Available</h3>
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
          <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Total Likes</h3>
          <p style={{ color: 'var(--success-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            {loading ? "..." : favorites}
          </p>
        </div>

        {userAnalytics && (
          <>
            <div style={{
              background: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Total Views</h3>
              <p style={{ color: 'var(--info-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {userAnalytics.overview.totalViews.toLocaleString()}
              </p>
            </div>

            <div style={{
              background: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Total Revenue</h3>
              <p style={{ color: 'var(--warning-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                ${userAnalytics.overview.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div style={{
              background: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ color: 'var(--text-accent)', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Total Sales</h3>
              <p style={{ color: 'var(--error-color)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {userAnalytics.overview.totalSales}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Analytics Charts */}
      {userAnalytics && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Performance Analytics</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{
              background: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <SimpleLineChart 
                data={userAnalytics.monthlyRevenue} 
                title="Monthly Revenue" 
                color="#f59e0b" 
              />
            </div>
            
            <div style={{
              background: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <SimpleLineChart 
                data={userAnalytics.monthlySales} 
                title="Monthly Sales" 
                color="#10b981" 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-accent)', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleUploadArtwork}>🎨 Upload Artwork</button>
          <button className="btn btn-primary" onClick={handleBrowseArtworks}>🛒 Browse Artworks</button>
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
              <p style={{ fontSize: '0.875rem' }}>Start by uploading your first artwork or browsing artworks!</p>
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
