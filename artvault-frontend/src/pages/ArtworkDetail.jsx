import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const response = await api.get(`/artworks/${id}`);
      if (response.data.success) {
        setArtwork(response.data.artwork);
        setLiked(
          response.data.artwork.likes?.some((like) => like.user === user?.id) ||
            false
        );
        setLikesCount(response.data.artwork.likes?.length || 0);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load artwork");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like artworks");
      return;
    }

    try {
      const response = await api.post(`/artworks/${id}/like`);
      if (response.data.success) {
        setLiked(response.data.isLiked);
        setLikesCount(response.data.likes);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(price.amount);
  };

  const getFilePreview = (file, index) => {
    const baseUrl = `http://localhost:5000/${file.url}`;

    switch (file.type) {
      case "image":
        return (
          <img
            key={index}
            src={baseUrl}
            alt={artwork.title}
            className="artwork-detail-image"
            onClick={() => setCurrentImageIndex(index)}
          />
        );
      case "video":
        return (
          <video
            key={index}
            src={baseUrl}
            className="artwork-detail-video"
            controls
          />
        );
      case "audio":
        return (
          <div key={index} className="artwork-detail-audio">
            <div className="audio-icon">🎵</div>
            <audio src={baseUrl} controls />
            <span className="audio-filename">{file.filename}</span>
          </div>
        );
      default:
        return (
          <div key={index} className="artwork-detail-document">
            <div className="document-icon">📄</div>
            <a
              href={baseUrl}
              download={file.filename}
              className="document-link"
            >
              {file.filename}
            </a>
          </div>
        );
    }
  };

  if (loading) return <div className="loading">Loading artwork...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!artwork) return <div className="error">Artwork not found</div>;

  const imageFiles =
    artwork.files?.filter((file) => file.type === "image") || [];
  const otherFiles =
    artwork.files?.filter((file) => file.type !== "image") || [];

  return (
    <div className="artwork-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="artwork-detail-content">
        <div className="artwork-media-section">
          {imageFiles.length > 0 && (
            <div className="main-image-container">
              <img
                src={`http://localhost:5000/${imageFiles[currentImageIndex]?.url}`}
                alt={artwork.title}
                className="main-artwork-image"
              />

              {imageFiles.length > 1 && (
                <div className="image-thumbnails">
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/${file.url}`}
                      alt={`${artwork.title} ${index + 1}`}
                      className={`thumbnail ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {otherFiles.length > 0 && (
            <div className="other-files-section">
              <h3>Additional Files</h3>
              <div className="other-files-grid">
                {otherFiles.map((file, index) => getFilePreview(file, index))}
              </div>
            </div>
          )}
        </div>

        <div className="artwork-info-section">
          <div className="artwork-header">
            <h1 className="artwork-title">{artwork.title}</h1>
            <p className="artwork-artist">by {artwork.artistName}</p>

            <div className="artwork-actions">
              <button
                onClick={handleLike}
                className={`like-btn ${liked ? "liked" : ""}`}
              >
                {liked ? "❤️" : "🤍"} {likesCount}
              </button>
            </div>
          </div>

          <div className="artwork-price-section">
            <div className="price-display">
              <span className="price-amount">{formatPrice(artwork.price)}</span>
              {artwork.price.negotiable && (
                <span className="price-negotiable">Negotiable</span>
              )}
            </div>

            {artwork.quantity > 1 && (
              <div className="quantity-display">
                <span className="quantity-label">Available Copies:</span>
                <span className="quantity-value">{artwork.quantity}</span>
              </div>
            )}
          </div>

          <div className="artwork-details-grid">
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">
                {artwork.category} • {artwork.subcategory}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Medium:</span>
              <span className="detail-value">{artwork.medium}</span>
            </div>

            {artwork.dimensions && (
              <div className="detail-item">
                <span className="detail-label">Dimensions:</span>
                <span className="detail-value">{artwork.dimensions}</span>
              </div>
            )}

            {artwork.yearCreated && (
              <div className="detail-item">
                <span className="detail-label">Year Created:</span>
                <span className="detail-value">{artwork.yearCreated}</span>
              </div>
            )}

            {artwork.style && (
              <div className="detail-item">
                <span className="detail-label">Style:</span>
                <span className="detail-value">{artwork.style}</span>
              </div>
            )}

            {artwork.technique && (
              <div className="detail-item">
                <span className="detail-label">Technique:</span>
                <span className="detail-value">{artwork.technique}</span>
              </div>
            )}
          </div>

          {artwork.description && (
            <div className="artwork-description">
              <h3>Description</h3>
              <p>{artwork.description}</p>
            </div>
          )}

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="artwork-tags-section">
              <h3>Tags</h3>
              <div className="artwork-tags">
                {artwork.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="artwork-stats-section">
            <div className="stat-item">
              <span className="stat-icon">👁️</span>
              <span className="stat-value">{artwork.views} views</span>
            </div>

            {artwork.folderStructure?.isFolder && (
              <div className="stat-item">
                <span className="stat-icon">📁</span>
                <span className="stat-value">
                  {artwork.folderStructure.totalFiles} files
                </span>
              </div>
            )}
          </div>

          <div className="contact-artist-section">
            <button className="contact-btn">Contact Artist</button>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
