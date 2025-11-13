import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/payment/PaymentModal.jsx";
import Standard3DCanvas from "../components/3d/Standard3DCanvas.jsx";
import api from "../api/axios.js";
import {
  savePostLoginIntent,
  getAndClearPostLoginIntent,
} from "../utils/postLoginIntent.js";

// Enhanced Image component with better fallback and debugging
const ImageWithFallback = ({ src, alt, className, fallbackText }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", src);
    setImageLoading(false);
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`${className} image-fallback`}>
        <div className="image-fallback-content">
          <div className="image-fallback-icon">🖼️</div>
          <div className="image-fallback-text">
            <h4>Image Not Available</h4>
            <p>{fallbackText}</p>
            <p className="image-url-debug">URL: {src}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-wrapper">
      {imageLoading && (
        <div className={`${className} image-loading-placeholder`}>
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Loading image...</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? "loading" : "loaded"}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoading ? "none" : "block" }}
      />
    </div>
  );
};

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [hasProcessedIntent, setHasProcessedIntent] = useState(false);

  useEffect(() => {
    fetchArtwork();
    setHasProcessedIntent(false); // Reset intent processing flag when artwork changes
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/artworks/${id}`);
      if (response.data.success) {
        setArtwork(response.data.artwork);
        setCurrentQuantity(response.data.artwork.quantity);
        setLiked(
          response.data.artwork.likes?.some((like) => like.user === user?.id) ||
            false
        );
        setLikesCount(response.data.artwork.likes?.length || 0);
      } else {
        setError("Artwork not found");
      }
    } catch (err) {
      console.error("Fetch artwork error:", err);
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

  const formatDimensions = (dimensions) => {
    if (!dimensions) return "";

    if (typeof dimensions === "string") return dimensions;

    if (typeof dimensions === "object") {
      const { width, height, depth, unit } = dimensions;
      if (depth && depth !== "0" && depth !== 0) {
        return `${width} × ${height} × ${depth} ${unit || "cm"}`;
      } else {
        return `${width} × ${height} ${unit || "cm"}`;
      }
    }

    return String(dimensions);
  };

  const getFilePreview = (file, index) => {
    const fileUrl = file.url.startsWith("http")
      ? file.url
      : `http://localhost:5000/${file.url}`;

    const is3DModel =
      file.type === "3d_model" ||
      artwork.category === "3d_model" ||
      (file.filename &&
        /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(file.filename));

    if (is3DModel) {
      return (
        <div key={index} className="artwork-detail-3d">
          <Standard3DCanvas
            fileUrl={fileUrl}
            fileName={file.filename}
            width={400}
            height={300}
            showControls={true}
            autoRotate={false}
            backgroundColor="#1a1a1a"
            showInfo={true}
            preventDownload={true}
            onModelClick={null}
            style={{
              cursor: "grab",
              borderRadius: "8px",
            }}
          />
        </div>
      );
    }

    switch (file.type) {
      case "image":
        return (
          <img
            key={index}
            src={fileUrl}
            alt={artwork.title}
            className="artwork-detail-image"
            onClick={() => setCurrentImageIndex(index)}
            onError={(e) => {
              console.error("Detail image failed to load:", fileUrl);
              e.target.style.display = "none";
            }}
          />
        );
      case "video":
        return (
          <div
            key={index}
            className="artwork-detail-video-container"
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "30px auto",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              border: "2px solid #4ecdc4",
              backgroundColor: "#000",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 aspect ratio
                backgroundColor: "#000",
              }}
            >
              <video
                src={fileUrl}
                className="artwork-detail-video"
                controls
                controlsList="nodownload"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={() => {
                  console.error("Video failed to load:", fileUrl);
                }}
              />
            </div>
            <div
              style={{
                padding: "12px 20px",
                backgroundColor: "rgba(0,0,0,0.9)",
                color: "#fff",
                fontSize: "14px",
                borderTop: "1px solid #333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#4ecdc4", fontSize: "18px" }}>🎬</span>
              <span style={{ fontWeight: "500" }}>
                {file.filename || "Video"}
              </span>
            </div>
          </div>
        );
      case "audio":
        return (
          <div
            key={index}
            className="artwork-detail-audio"
            style={{
              width: "90%",
              maxWidth: "min(1000px, 85vw)",
              margin: "20px auto",
              padding: "clamp(20px, 3vw, 40px)",
              borderRadius: "12px",
              backgroundColor: "#1a1a1a",
              border: "2px solid #4ecdc4",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(15px, 2vw, 25px)",
                marginBottom: "clamp(15px, 2vw, 25px)",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(40px, 5vw, 60px)",
                  background: "linear-gradient(135deg, #4ecdc4, #44a3a0)",
                  borderRadius: "50%",
                  width: "clamp(70px, 8vw, 100px)",
                  height: "clamp(70px, 8vw, 100px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(78, 205, 196, 0.3)",
                  flexShrink: 0,
                }}
              >
                🎵
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: "clamp(16px, 2vw, 22px)",
                    fontWeight: "600",
                    marginBottom: "5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.filename || "Audio File"}
                </div>
                <div
                  style={{
                    color: "#888",
                    fontSize: "clamp(12px, 1.5vw, 16px)",
                  }}
                >
                  Audio Track
                </div>
              </div>
            </div>
            <audio
              src={fileUrl}
              controls
              controlsList="nodownload"
              style={{
                width: "100%",
                height: "clamp(45px, 5vh, 60px)",
                borderRadius: "8px",
              }}
              onError={() => {
                console.error("Audio failed to load:", fileUrl);
              }}
            />
          </div>
        );
      default:
        return (
          <div key={index} className="artwork-detail-document">
            <div className="document-icon">📄</div>
            <a
              href={fileUrl}
              download={file.filename}
              className="document-link"
            >
              {file.filename}
            </a>
          </div>
        );
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      const intent = {
        action: "buy",
        returnTo: location.pathname,
      };

      // Save to localStorage using utility function (survives OAuth redirects)
      savePostLoginIntent(intent);

      // Navigate with state for standard login compatibility
      navigate("/login", { state: { from: location.pathname, action: "buy" } });
      return;
    }
    setShowPaymentModal(true);
  };

  // Consolidated post-login handler: checks both location.state and localStorage
  useEffect(() => {
    console.log("ArtworkDetail: useEffect triggered", {
      user: !!user,
      artwork: !!artwork,
      hasProcessedIntent,
      triggerBuyNow: location.state?.triggerBuyNow,
      pathname: location.pathname
    });

    if (!user || !artwork || hasProcessedIntent) return;

    // Check location.state first (standard login flow)
    if (location.state?.triggerBuyNow) {
      console.log("ArtworkDetail: triggerBuyNow detected in location.state");
      
      // Validate artwork availability before opening modal
      if (!artwork) {
        console.log("ArtworkDetail: Artwork not found, redirecting to browse");
        setError("Artwork not found. It may have been removed.");
        navigate("/browse", { replace: true });
        return;
      }

      const availableQuantity = currentQuantity !== null ? currentQuantity : artwork.quantity;
      if (availableQuantity === 0) {
        console.log("ArtworkDetail: Artwork sold out");
        setError("This artwork is no longer available for purchase.");
        setHasProcessedIntent(true);
        return;
      }

      // Open modal and mark intent as processed
      console.log("ArtworkDetail: Opening payment modal");
      setShowPaymentModal(true);
      setHasProcessedIntent(true);
      return;
    }

    // Fall back to localStorage (OAuth flow or page refresh)
    const intent = getAndClearPostLoginIntent();
    console.log("ArtworkDetail: Checking localStorage intent", intent);
    
    if (intent?.action === "buy" && intent?.returnTo === location.pathname) {
      console.log("ArtworkDetail: localStorage intent matched");
      
      // Validate artwork availability before opening modal
      if (!artwork) {
        console.log("ArtworkDetail: Artwork not found, redirecting to browse");
        setError("Artwork not found. It may have been removed.");
        navigate("/browse", { replace: true });
        return;
      }

      const availableQuantity = currentQuantity !== null ? currentQuantity : artwork.quantity;
      if (availableQuantity === 0) {
        console.log("ArtworkDetail: Artwork sold out");
        setError("This artwork is no longer available for purchase.");
        setHasProcessedIntent(true);
        return;
      }

      console.log("ArtworkDetail: Opening payment modal from localStorage intent");
      setShowPaymentModal(true);
      setHasProcessedIntent(true);
    }
  }, [user, artwork, location.pathname, location.state, currentQuantity, navigate, hasProcessedIntent]);

  if (loading) {
    return (
      <div className="artwork-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artwork-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <div className="error-container">
          <h2>Error Loading Artwork</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="artwork-detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <div className="error-container">
          <h2>Artwork Not Found</h2>
          <p>
            The artwork you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Separate files by type
  const imageFiles =
    artwork.files?.filter((file) => file.type === "image") || [];
  const threeDFiles =
    artwork.files?.filter(
      (file) =>
        file.type === "3d_model" ||
        artwork.category === "3d_model" ||
        (file.filename &&
          /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(file.filename))
    ) || [];
  const otherFiles =
    artwork.files?.filter(
      (file) =>
        file.type !== "image" &&
        file.type !== "3d_model" &&
        !(
          file.filename &&
          /\.(gltf|glb|obj|fbx|stl|blend|dae|3ds|ply)$/i.test(file.filename)
        )
    ) || [];

  // Get primary file for 3D modal
  const primary3DFile =
    threeDFiles.find((file) => file.isPrimary) || threeDFiles[0];

  return (
    <div className="artwork-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="artwork-detail-content">
        <div className="artwork-media-section">
          {/* 3D Model Display */}
          {threeDFiles.length > 0 && (
            <div className="main-3d-container">
              <div className="all-3d-models-grid">
                <h4>3D Models ({threeDFiles.length})</h4>
                <div className="models-grid">
                  {threeDFiles.map((file, index) => (
                    <div
                      key={index}
                      className="model-item"
                      style={{
                        position: "relative",
                        marginBottom: "20px",
                      }}
                    >
                      <Standard3DCanvas
                        fileUrl={
                          file.url.startsWith("http")
                            ? file.url
                            : `http://localhost:5000/${file.url}`
                        }
                        fileName={file.filename}
                        width={Math.min(
                          Math.max(windowDimensions.width * 0.45, 500),
                          900
                        )}
                        height={Math.min(
                          Math.max(windowDimensions.height * 0.4, 400),
                          600
                        )}
                        showControls={true}
                        autoRotate={index > 0}
                        backgroundColor="#1a1a1a"
                        showInfo={false}
                        preventDownload={true}
                        onModelClick={() => {
                          console.log(
                            "Double-click detected - opening fullscreen modal"
                          );
                          setShowThreeDModal(true);
                        }}
                        style={{
                          cursor: "grab",
                          borderRadius: "12px",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                          border:
                            index === 0
                              ? "2px solid #4ecdc4"
                              : "2px solid #333",
                        }}
                      />
                      <div
                        className="model-info"
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 12px",
                          backgroundColor: "#1a1a1a",
                          borderRadius: "6px",
                          border: "1px solid #333",
                        }}
                      >
                        <span
                          className="model-filename"
                          style={{
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {file.filename}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Image Display - Only if no 3D models */}
          {threeDFiles.length === 0 && imageFiles.length > 0 && (
            <div className="main-image-container">
              <ImageWithFallback
                src={
                  imageFiles[currentImageIndex]?.url.startsWith("http")
                    ? imageFiles[currentImageIndex]?.url
                    : `http://localhost:5000/${imageFiles[currentImageIndex]?.url}`
                }
                alt={artwork.title}
                className="main-artwork-image"
                fallbackText={`Artwork: ${artwork.title}`}
              />

              {imageFiles.length > 1 && (
                <div className="image-thumbnails">
                  {imageFiles.map((file, index) => (
                    <img
                      key={index}
                      src={
                        file.url.startsWith("http")
                          ? file.url
                          : `http://localhost:5000/${file.url}`
                      }
                      alt={`${artwork.title} ${index + 1}`}
                      className={`thumbnail ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        console.error(
                          "Thumbnail failed to load:",
                          e.target.src
                        );
                        e.target.style.opacity = "0.3";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Additional Images - Show as thumbnails if 3D model is primary */}
          {threeDFiles.length > 0 && imageFiles.length > 0 && (
            <div className="additional-images-section">
              <h4>Reference Images</h4>
              <div className="reference-images-grid">
                {imageFiles.map((file, index) => (
                  <img
                    key={index}
                    src={
                      file.url.startsWith("http")
                        ? file.url
                        : `http://localhost:5000/${file.url}`
                    }
                    alt={`${artwork.title} reference ${index + 1}`}
                    className="reference-image"
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      console.error(
                        "Reference image failed to load:",
                        e.target.src
                      );
                      e.target.style.opacity = "0.3";
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Files */}
          {otherFiles.length > 0 && (
            <div className="other-files-section">
              <h3>Additional Files</h3>
              <div className="other-files-grid">
                {otherFiles.map((file, index) => getFilePreview(file, index))}
              </div>
            </div>
          )}

          {/* Fallback when no media files */}
          {threeDFiles.length === 0 &&
            imageFiles.length === 0 &&
            otherFiles.length === 0 && (
              <div className="no-media-fallback">
                <div className="no-media-icon">🖼️</div>
                <h3>No Media Files</h3>
                <p>This artwork doesn't have any associated media files.</p>
              </div>
            )}
        </div>

        <div className="artwork-info-section">
          <div className="artwork-header">
            <h1 className="artwork-title">{artwork.title}</h1>
            <p className="artwork-artist">
              by {artwork.artistName}
              {user &&
                (user.id === artwork.artist ||
                  user._id === artwork.artist ||
                  user.id === artwork.artist?._id ||
                  user._id === artwork.artist?._id) && (
                  <span className="artwork-owner-badge">👑 Your Artwork</span>
                )}
            </p>

            <div className="artwork-actions">
              <button
                onClick={handleLike}
                className={`like-btn ${liked ? "liked" : ""}`}
              >
                {liked ? "❤️" : "🤍"} {likesCount}
              </button>
            </div>
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
                <span className="detail-value">
                  {formatDimensions(artwork.dimensions)}
                </span>
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
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">👁️</span>
                <span className="stat-value">{artwork.views} views</span>
              </div>

              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{likesCount} likes</span>
              </div>

              {artwork.folderStructure?.isFolder && (
                <div className="stat-item">
                  <span className="stat-icon">📁</span>
                  <span className="stat-value">
                    {artwork.folderStructure.totalFiles} files
                  </span>
                </div>
              )}

              {(currentQuantity || artwork.quantity) > 0 && (
                <div className="stat-item">
                  <span className="stat-icon">📦</span>
                  <span className="stat-value">
                    {currentQuantity !== null
                      ? currentQuantity
                      : artwork.quantity}{" "}
                    available
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="contact-artist-section">
            {user &&
            (user.id === artwork.artist ||
              user._id === artwork.artist ||
              user.id === artwork.artist?._id ||
              user._id === artwork.artist?._id) ? (
              <div className="owner-actions">
                <button
                  className="edit-artwork-btn"
                  onClick={() => navigate(`/edit-artwork/${artwork._id}`)}
                >
                  ✏️ Edit Artwork
                </button>
                <button
                  className="view-stats-btn"
                  onClick={() => navigate('/analytics')}
                >
                  📊 View Analytics
                </button>
              </div>
            ) : (
              <div className="buyer-actions">
                <button className="contact-btn">📧 Contact Artist</button>
                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={
                    (currentQuantity !== null
                      ? currentQuantity
                      : artwork.quantity) === 0
                  }
                >
                  {(currentQuantity !== null
                    ? currentQuantity
                    : artwork.quantity) === 0
                    ? "❌ Sold Out"
                    : "🛒 Buy Now"}
                </button>
              </div>
            )}
          </div>

          <div className="artwork-price-section-bottom">
            <div className="price-display-bottom">
              <div className="price-header">
                <h3>Price</h3>
              </div>
              <div className="price-content">
                <span className="price-amount-bottom">
                  {formatPrice(artwork.price)}
                </span>
                {artwork.price.negotiable && (
                  <span className="price-negotiable-bottom">Negotiable</span>
                )}
              </div>

              {(currentQuantity || artwork.quantity) === 0 && (
                <div className="sold-out-notice-bottom">
                  <span className="sold-out">❌ Sold Out</span>
                </div>
              )}

              {(currentQuantity || artwork.quantity) <= 5 &&
                (currentQuantity || artwork.quantity) > 0 && (
                  <div className="low-stock-notice-bottom">
                    <span className="low-stock-warning">
                      ⚠️ Limited stock - Only{" "}
                      {currentQuantity !== null
                        ? currentQuantity
                        : artwork.quantity}{" "}
                      left!
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        artwork={{
          ...artwork,
          quantity:
            currentQuantity !== null ? currentQuantity : artwork.quantity,
        }}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        quantity={1}
        onOrderComplete={(remainingQuantity) => {
          setCurrentQuantity(remainingQuantity);
          setShowPaymentModal(false);
        }}
      />
    </div>
  );
};

export default ArtworkDetail;
