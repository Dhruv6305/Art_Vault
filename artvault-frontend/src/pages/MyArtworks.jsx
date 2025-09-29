import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import ArtworkCard from "../components/ui/ArtworkCard.jsx";
import DebugUser from "../components/DebugUser.jsx";

const MyArtworks = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchMyArtworks();
    }
  }, [user, filter, sortBy]);

  const fetchMyArtworks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/artworks/user/${user._id || user.id}`, {
        params: {
          availability: filter === "all" ? undefined : filter,
          sortBy,
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

  const handleDelete = async (artworkId) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) {
      return;
    }

    try {
      const response = await api.delete(`/artworks/${artworkId}`);

      if (response.data.success) {
        setArtworks((prev) =>
          prev.filter((artwork) => artwork._id !== artworkId)
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete artwork");
    }
  };

  const handleStatusChange = async (artworkId, newStatus) => {
    try {
      const response = await api.put(`/artworks/${artworkId}`, {
        availability: newStatus,
      });

      if (response.data.success) {
        setArtworks((prev) =>
          prev.map((artwork) =>
            artwork._id === artworkId
              ? { ...artwork, availability: newStatus }
              : artwork
          )
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "#28a745";
      case "sold":
        return "#dc3545";
      case "reserved":
        return "#ffc107";
      case "draft":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return "✅";
      case "sold":
        return "💰";
      case "reserved":
        return "⏳";
      case "draft":
        return "📝";
      default:
        return "❓";
    }
  };

  if (!user) {
    return (
      <div className="my-artworks-page">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your artworks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-artworks-page">
      {false && <DebugUser />}
      <div className="my-artworks-header">
        <div className="header-content">
          <h1>My Artworks</h1>
          <Link to="/add-artwork" className="btn btn-primary">
            ➕ Add New Artwork
          </Link>
        </div>

        <div className="artworks-stats">
          <div className="stat-item">
            <span className="stat-number">{artworks.length}</span>
            <span className="stat-label">Total Artworks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "available").length}
            </span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "sold").length}
            </span>
            <span className="stat-label">Sold</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "draft").length}
            </span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
      </div>

      <div className="artworks-controls">
        <div className="filters">
          <label>Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Artworks</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="sorting">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="title">Title</option>
            <option value="price.amount">Price</option>
            <option value="views">Views</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="artworks-content">
        {loading ? (
          <div className="loading-container">
            <span className="spinner"></span>
            <p>Loading your artworks...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No artworks found</h3>
            <p>
              {filter === "all"
                ? "You haven't added any artworks yet."
                : `No artworks with status "${filter}".`}
            </p>
            <Link to="/add-artwork" className="btn btn-primary">
              Add Your First Artwork
            </Link>
          </div>
        ) : (
          <div className="artworks-grid">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="artwork-item">
                <ArtworkCard artwork={artwork} showActions={false} />

                <div className="artwork-management">
                  <div className="artwork-status">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(artwork.availability),
                      }}
                    >
                      {getStatusIcon(artwork.availability)}{" "}
                      {artwork.availability}
                    </span>
                  </div>

                  <div className="artwork-stats">
                    <span className="stat">👁️ {artwork.views}</span>
                    <span className="stat">
                      ❤️ {artwork.likes?.length || 0}
                    </span>
                  </div>

                  <div className="artwork-actions">
                    <select
                      value={artwork.availability}
                      onChange={(e) =>
                        handleStatusChange(artwork._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="draft">Draft</option>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>

                    <Link
                      to={`/edit-artwork/${artwork._id}`}
                      className="btn-icon edit"
                      title="Edit artwork"
                    >
                      ✏️
                    </Link>

                    <button
                      onClick={() => handleDelete(artwork._id)}
                      className="btn-icon delete"
                      title="Delete artwork"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArtworks;
