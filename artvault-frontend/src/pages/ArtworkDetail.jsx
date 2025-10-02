import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PaymentModal from "../components/payment/PaymentModal.jsx";
import Standard3DCanvas from "../components/3d/Standard3DCanvas.jsx";
import ThreeDModelModal from "../components/3d/ThreeDModelModal.jsx";
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(null);
  const [showThreeDModal, setShowThreeDModal] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    fetchArtwork();
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
      const response = await api.get(`/artworks/${id}`);
      if (response.data.success) {
        setArtwork(response.data.artwork);
        setCurrentQuantity(response.data.artwork.quantity);
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

  const formatDimensions = (dimensions) => {
    if (!dimensions) return "";

    // If it's already a string, return it
    if (typeof dimensions === "string") return dimensions;

    // If it's an object, format it
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
    // Construct the full URL for the file
    const fileUrl = file.url.startsWith("http")
      ? file.url
      : `http://localhost:5000/${file.url}`;

    console.log("Detail file URL:", fileUrl);

    // Check if it's a 3D model by file type OR file extension OR artwork category
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
            onModelClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowThreeDModal(true);
            }}
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
          <video
            key={index}
            src={fileUrl}
            className="artwork-detail-video"
            controls
            onError={(e) => {
              console.error("Video failed to load:", fileUrl);
            }}
          />
        );
      case "audio":
        return (
          <div key={index} className="artwork-detail-audio">
            <div className="audio-icon">🎵</div>
            <audio
              src={fileUrl}
              controls
              onError={(e) => {
                console.error("Audio failed to load:", fileUrl);
              }}
            />
            <span className="audio-filename">{file.filename}</span>
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

  if (loading) return <div className="loading">Loading artwork...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!artwork) return <div className="error">Artwork not found</div>;

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
          {/* 3D Model Display - Takes priority and 1/4+ of screen */}
          {threeDFiles.length > 0 && (
            <div className="main-3d-container">
              {/* All 3D Models - Same Size Grid */}
              <div className="all-3d-models-grid">
                <h4>3D Models ({threeDFiles.length})</h4>
                <div className="models-grid">
                  {threeDFiles.map((file, index) => (
                    <div key={index} className="model-item">
                      <Standard3DCanvas
                        fileUrl={
                          file.url.startsWith("http")
                            ? file.url
                            : `http://localhost:5000/${file.url}`
                        }
                        fileName={file.filename}
                        width={Math.max(windowDimensions.width * 0.5, 640)} // 1/2 of screen width, minimum 640px
                        height={Math.max(windowDimensions.height * 0.25, 240)} // 1/4 of screen height, minimum 240px
                        showControls={true}
                        autoRotate={index > 0} // Auto-rotate for non-primary models
                        backgroundColor="#1a1a1a"
                        showInfo={true}
                        preventDownload={true}
                        onModelClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
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
                      <div className="model-info">
                        <span className="model-filename">{file.filename}</span>
                        {index === 0 && (
                          <span className="primary-badge">Primary</span>
                        )}
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
              <img
                src={
                  imageFiles[currentImageIndex]?.url.startsWith("http")
                    ? imageFiles[currentImageIndex]?.url
                    : `http://localhost:5000/${imageFiles[currentImageIndex]?.url}`
                }
                alt={artwork.title}
                className="main-artwork-image"
                onError={(e) => {
                  console.error("Main image failed to load:", e.target.src);
                  e.target.style.display = "none";
                }}
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

            {(currentQuantity || artwork.quantity) > 0 && (
              <div className="quantity-display">
                <span className="quantity-label">Available Copies:</span>
                <span
                  className={`quantity-value ${
                    (currentQuantity || artwork.quantity) <= 5
                      ? "low-stock"
                      : ""
                  }`}
                >
                  {currentQuantity !== null
                    ? currentQuantity
                    : artwork.quantity}
                </span>
                {(currentQuantity || artwork.quantity) <= 5 &&
                  (currentQuantity || artwork.quantity) > 0 && (
                    <span className="low-stock-warning">⚠️ Limited stock!</span>
                  )}
                {(currentQuantity || artwork.quantity) === 0 && (
                  <span className="sold-out">❌ Sold Out</span>
                )}
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
            <button
              className="buy-now-btn"
              onClick={() => setShowPaymentModal(true)}
              disabled={
                (currentQuantity !== null
                  ? currentQuantity
                  : artwork.quantity) === 0
              }
            >
              {(currentQuantity !== null
                ? currentQuantity
                : artwork.quantity) === 0
                ? "Sold Out"
                : "Buy Now"}
            </button>
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

      {/* 3D Model Modal */}
      <ThreeDModelModal
        isOpen={showThreeDModal}
        onClose={() => setShowThreeDModal(false)}
        fileUrl={
          primary3DFile
            ? primary3DFile.url.startsWith("http")
              ? primary3DFile.url
              : `http://localhost:5000/${primary3DFile.url}`
            : null
        }
        fileName={primary3DFile?.filename}
        artworkTitle={artwork.title}
        artworkArtist={artwork.artistName}
      />
    </div>
  );
};

export default ArtworkDetail;
