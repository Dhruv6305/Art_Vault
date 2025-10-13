import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";
import ThreeDModelModal from "../3d/ThreeDModelModal.jsx";

const ArtworkCard = React.memo(({ artwork, showActions = true }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(
    artwork.likes?.some((like) => like.user === user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(artwork.likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const [showThreeDModal, setShowThreeDModal] = useState(false);

  const primaryFile =
    artwork.files?.find((file) => file.isPrimary) || artwork.files?.[0];

  const handleLike = useCallback(async (e) => {
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
  }, [user, artwork._id]);

  // Memoize price formatter for better performance
  const priceFormatter = useMemo(() => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }), []);

  const formatPrice = useCallback((price) => {
    return priceFormatter.format(price.amount);
  }, [priceFormatter]);



  const getFilePreview = (file) => {
    if (!file) return null;

    // Construct the full URL for the file
    const fileUrl = file.url.startsWith("http")
      ? file.url
      : `http://localhost:5000/${file.url}`;



    // Check if it's a 3D model by file type OR file extension
    const is3DModel =
      file.type === "3d_model" ||
      artwork.category === "3d_model" ||
      (file.filename &&
        /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(file.filename));

    if (is3DModel) {
      return (
        <div 
          className="artwork-3d-preview-placeholder"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowThreeDModal(true);
          }}
        >
          <div className="artwork-3d-icon">🎮</div>
          <div className="artwork-3d-text">3D Model</div>
          <div className="artwork-3d-subtitle">Click to view</div>
        </div>
      );
    }

    switch (file.type) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={artwork.title}
            className="artwork-image"
            loading="lazy"
            decoding="async"
            onError={() => {
              console.error("Image failed to load:", fileUrl);
            }}
          />
        );
      case "video":
        return (
          <video
            src={fileUrl}
            className="artwork-video"
            controls={false}
            muted
            preload="none"
            poster={`${fileUrl}#t=1`}
            onError={() => {
              console.error("Video failed to load:", fileUrl);
            }}
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
            <audio
              src={fileUrl}
              controls
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
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
      case "3d_model":
        return "🎲";
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
    <>
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
            <p className="artwork-artist">
              by {artwork.artistName}
              {user && (user.id === artwork.artist || user._id === artwork.artist) && (
                <span className="owner-badge">👑 Your Art</span>
              )}
            </p>

            <div className="artwork-details">
              <span className="artwork-medium">{artwork.medium}</span>
              {artwork.yearCreated && (
                <span className="artwork-year">• {artwork.yearCreated}</span>
              )}
            </div>

            <div className="artwork-footer">
              <div className="artwork-price">
                <span className="price-amount">
                  {formatPrice(artwork.price)}
                </span>
                {artwork.price.negotiable && (
                  <span className="price-negotiable">Negotiable</span>
                )}
              </div>

              <div className="artwork-card-stats">
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

      {/* 3D Model Modal */}
      <ThreeDModelModal
        isOpen={showThreeDModal}
        onClose={() => setShowThreeDModal(false)}
        fileUrl={
          primaryFile &&
          (primaryFile.type === "3d_model" ||
            artwork.category === "3d_model" ||
            (primaryFile.filename &&
              /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(
                primaryFile.filename
              )))
            ? primaryFile.url.startsWith("http")
              ? primaryFile.url
              : `http://localhost:5000/${primaryFile.url}`
            : null
        }
        fileName={primaryFile?.filename}
        artworkTitle={artwork.title}
        artworkArtist={artwork.artistName}
      />
    </>
  );
});

export default ArtworkCard;
