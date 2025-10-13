import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const MyArtworks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleDelete = useCallback(async (artworkId) => {
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
  }, []);

  const handleStatusChange = useCallback(async (artworkId, newStatus) => {
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
  }, []);

  const formatPrice = useCallback((price) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(price.amount);
  }, []);

  const getFilePreview = useCallback((artwork) => {
    const primaryFile = artwork.files?.find((file) => file.isPrimary) || artwork.files?.[0];
    
    if (!primaryFile) {
      return (
        <div className="my-artwork-preview-fallback">
          🎨 {artwork.title}
        </div>
      );
    }

    const fileUrl = primaryFile.url.startsWith("http")
      ? primaryFile.url
      : `http://localhost:5000/${primaryFile.url}`;

    // Check if it's a 3D model
    const is3DModel = primaryFile.type === "3d_model" || 
      artwork.category === "3d_model" ||
      (primaryFile.filename && /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(primaryFile.filename));

    if (is3DModel) {
      return (
        <div className="my-artwork-3d-preview">
          <div className="artwork-3d-icon">🎮</div>
          <div className="artwork-3d-text">3D Model</div>
        </div>
      );
    }

    switch (primaryFile.type) {
      case "image":
        return (
          <>
            <img
              src={fileUrl}
              alt={artwork.title}
              className="my-artwork-image"
              loading="lazy"
              onError={(e) => {
                console.error("MyArtworks image failed to load:", fileUrl);
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="my-artwork-preview-fallback" style={{ display: 'none' }}>
              🖼️ Image Not Available
            </div>
          </>
        );
      case "video":
        return (
          <video
            src={fileUrl}
            className="my-artwork-video"
            muted
            preload="none"
          />
        );
      case "audio":
        return (
          <div className="my-artwork-audio-preview">
            <div className="audio-icon">🎵</div>
            <div className="audio-text">Audio</div>
          </div>
        );
      default:
        return (
          <div className="my-artwork-preview-fallback">
            📄 {artwork.title}
          </div>
        );
    }
  }, []);

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
    <div className="my-artworks-container">
      <div className="my-artworks-header">
        <div className="header-content">
          <h1>My Artworks</h1>
        </div>
        <Link to="/add-artwork" className="add-artwork-btn">
          ➕ Add New Artwork
        </Link>
      </div>
      
      <div className="header-subtitle">
        <p>Manage and track your creative portfolio</p>
      </div>

      <div className="artworks-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <span className="stat-number">{artworks.length}</span>
            <span className="stat-label">Total Artworks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "available").length}
            </span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "sold").length}
            </span>
            <span className="stat-label">Sold</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <span className="stat-number">
              {artworks.filter((a) => a.availability === "draft").length}
            </span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
      </div>

      <div className="artworks-controls">
        <div className="controls-section">
          <div className="filter-group">
            <label>Filter by status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="modern-select"
            >
              <option value="all">All Artworks</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="modern-select"
            >
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
              <option value="title">Title</option>
              <option value="price.amount">Price</option>
              <option value="views">Views</option>
            </select>
          </div>
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
            <div className="spinner"></div>
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
            <Link to="/add-artwork" className="add-first-artwork-btn">
              Add Your First Artwork
            </Link>
          </div>
        ) : (
          <div className="my-artworks-grid">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="my-artwork-card">
                <div className="my-artwork-preview" onClick={() => navigate(`/artwork/${artwork._id}`)}>
                  {getFilePreview(artwork)}
                  <div className="my-artwork-preview-fallback" style={{ display: 'none' }}>
                    🎨 {artwork.title}
                  </div>
                </div>

                <div className="my-artwork-info">
                  <div className="artwork-header">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(artwork.availability) }}
                    >
                      {getStatusIcon(artwork.availability)} {artwork.availability}
                    </span>
                  </div>

                  <div className="artwork-details">
                    <p className="artwork-category">{artwork.category} • {artwork.medium}</p>
                    <p className="artwork-price">{formatPrice(artwork.price)}</p>
                  </div>

                  <div className="my-artwork-stats">
                    <span className="stat-item">👁️ {artwork.views}</span>
                    <span className="stat-item">❤️ {artwork.likes?.length || 0}</span>
                    <span className="stat-item">📦 {artwork.quantity}</span>
                  </div>

                  <div className="artwork-actions">
                    <select
                      value={artwork.availability}
                      onChange={(e) => handleStatusChange(artwork._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="draft">Draft</option>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>

                    <div className="action-buttons">
                      <Link
                        to={`/edit-artwork/${artwork._id}`}
                        className="action-btn edit-btn"
                        title="Edit artwork"
                      >
                        ✏️
                      </Link>

                      <button
                        onClick={() => handleDelete(artwork._id)}
                        className="action-btn delete-btn"
                        title="Delete artwork"
                      >
                        🗑️
                      </button>
                    </div>
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
