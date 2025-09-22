import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

const ArtworkCard = ({ artwork, showActions = true }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(
    artwork.likes?.some((like) => like.user === user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(artwork.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  const primaryFile =
    artwork.files?.find((file) => file.isPrimary) || artwork.files?.[0];

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please log in to like artworks");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/artworks/${artwork._id}/like`);

      if (response.data.success) {
        setLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoading(false);
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

  const getFilePreview = (file) => {
    if (!file) return null;

    switch (file.type) {
      case "image":
        return (
          <img
            src={`http://localhost:5000/${file.url}`}
            alt={artwork.title}
            className="artwork-image"
          />
        );
      case "video":
        return (
          <video
            src={`http://localhost:5000/${file.url}`}
            className="artwork-video"
            controls={false}
            muted
            poster={`http://localhost:5000/${file.url}#t=1`}
          />
        );
      case "audio":
        return (
          <div className="artwork-audio-preview">
            <div className="audio-icon">🎵</div>
            <div className="audio-info">
              <span className="audio-title">{artwork.title}</span>
              <span className="audio-duration">
                {file.duration
                  ? `${Math.floor(file.duration / 60)}:${(file.duration % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Audio"}
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="artwork-document-preview">
            <div className="document-icon">📄</div>
            <span className="document-name">{file.filename}</span>
          </div>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "visual_art":
        return "🎨";
      case "photography":
        return "📸";
      case "digital_art":
        return "💻";
      case "sculpture":
        return "🗿";
      case "music":
        return "🎵";
      case "video":
        return "🎥";
      default:
        return "🎭";
    }
  };

  return (
    <div className="artwork-card">
      <Link to={`/artwork/${artwork._id}`} className="artwork-link">
        <div className="artwork-preview">
          {primaryFile ? (
            getFilePreview(primaryFile)
          ) : (
            <div className="no-preview">
              <span className="no-preview-icon">
                {getCategoryIcon(artwork.category)}
              </span>
              <span className="no-preview-text">No Preview</span>
            </div>
          )}

          <div className="artwork-overlay">
            <div className="artwork-category">
              {getCategoryIcon(artwork.category)} {artwork.subcategory}
            </div>

            {showActions && (
              <button
                onClick={handleLike}
                className={`like-btn ${liked ? "liked" : ""}`}
                disabled={loading}
              >
                {liked ? "❤️" : "🤍"} {likesCount}
              </button>
            )}
          </div>
        </div>

        <div className="artwork-info">
          <h3 className="artwork-title">{artwork.title}</h3>
          <p className="artwork-artist">by {artwork.artistName}</p>

          <div className="artwork-details">
            <span className="artwork-medium">{artwork.medium}</span>
            {artwork.yearCreated && (
              <span className="artwork-year">• {artwork.yearCreated}</span>
            )}
          </div>

          <div className="artwork-footer">
            <div className="artwork-price">
              <span className="price-amount">{formatPrice(artwork.price)}</span>
              {artwork.price.negotiable && (
                <span className="price-negotiable">Negotiable</span>
              )}
            </div>

            <div className="artwork-stats">
              <span className="views">👁️ {artwork.views}</span>
              {artwork.quantity > 1 && (
                <span className="quantity-info">
                  📦 {artwork.quantity} available
                </span>
              )}
              {artwork.folderStructure?.isFolder ? (
                <span className="folder-info">
                  📁 {artwork.folderStructure.totalFiles} files
                </span>
              ) : artwork.files?.length > 1 ? (
                <span className="file-count">📁 {artwork.files.length}</span>
              ) : null}
            </div>
          </div>

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="artwork-tags">
              {artwork.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
              {artwork.tags.length > 3 && (
                <span className="tag-more">+{artwork.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ArtworkCard;
