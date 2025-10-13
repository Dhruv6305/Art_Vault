import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import ArtworkCard from "../components/ui/ArtworkCard.jsx";

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/artworks", {
        params: {
          availability: "available",
          limit: 6, // Reduced to 6 artworks for better performance
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      if (response.data.success) {
        setArtworks(response.data.artworks);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load artworks");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="marketplace-page">
      {/* Enhanced Hero Section */}
      <div className="marketplace-hero">
        <div className="marketplace-hero-content">
          <h1>Art Marketplace</h1>
          <p>Discover, collect, and trade extraordinary digital artworks from talented creators worldwide.</p>

          <div className="marketplace-stats">
            <div className="marketplace-stat">
              <span className="marketplace-stat-number">{artworks.length}</span>
              <span className="marketplace-stat-label">Artworks</span>
            </div>
            <div className="marketplace-stat">
              <span className="marketplace-stat-number">50+</span>
              <span className="marketplace-stat-label">Artists</span>
            </div>
            <div className="marketplace-stat">
              <span className="marketplace-stat-number">24/7</span>
              <span className="marketplace-stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="marketplace-controls">
        <div className="marketplace-search-section">
          <div className="marketplace-search-wrapper">
            <input
              type="text"
              placeholder="Search artworks, artists, or categories..."
              className="marketplace-search-input"
            />
            <div className="marketplace-search-icon">🔍</div>
          </div>
        </div>

        <div className="marketplace-filters">
          <div className="marketplace-filter-group">
            <label className="marketplace-filter-label">Category</label>
            <select className="marketplace-filter-select">
              <option value="">All Categories</option>
              <option value="digital_art">Digital Art</option>
              <option value="3d_model">3D Models</option>
              <option value="photography">Photography</option>
              <option value="visual_art">Visual Art</option>
            </select>
          </div>

          <div className="marketplace-filter-group">
            <label className="marketplace-filter-label">Price Range</label>
            <div className="marketplace-price-range">
              <input
                type="number"
                placeholder="Min"
                className="marketplace-price-input"
              />
              <span className="marketplace-price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                className="marketplace-price-input"
              />
            </div>
          </div>

          <div className="marketplace-filter-group">
            <label className="marketplace-filter-label">Sort By</label>
            <select className="marketplace-filter-select">
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <button className="marketplace-clear-filters">
            🗑️ Clear Filters
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="marketplace-results">
        <div className="marketplace-results-header">
          <div className="marketplace-results-info">
            Showing <span className="marketplace-results-count">{artworks.length}</span> artworks
          </div>

          <div className="marketplace-sort-controls">
            <div className="marketplace-view-toggle">
              <button className="marketplace-view-btn active">⊞</button>
              <button className="marketplace-view-btn">☰</button>
            </div>
          </div>
        </div>

        {error && (
          <div className="marketplace-error">
            <span className="marketplace-error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="marketplace-artwork-grid">
          {loading ? (
            <div className="marketplace-loading">
              <div className="marketplace-loading-spinner"></div>
              <div className="marketplace-loading-text">Loading amazing artworks...</div>
            </div>
          ) : artworks.length === 0 ? (
            <div className="marketplace-empty">
              <div className="marketplace-empty-icon">🎨</div>
              <h3>No artworks available</h3>
              <p>Be the first to discover amazing digital creations! Check back soon for new artworks from talented artists.</p>
              <button
                className="marketplace-empty-action"
                onClick={() => navigate("/sell")}
              >
                Start Selling Your Art
              </button>
            </div>
          ) : (
            // Real artwork cards using shared component
            artworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                artwork={artwork}
                showActions={true}
              />
            ))
          )}
        </div>

        {artworks.length > 0 && (
          <div className="marketplace-browse-all">
            <button
              className="browse-all-btn"
              onClick={() => navigate("/browse")}
            >
              Browse All Artworks →
            </button>
          </div>
        )}
      </div>


    </div>
  );
};

export default Marketplace;
