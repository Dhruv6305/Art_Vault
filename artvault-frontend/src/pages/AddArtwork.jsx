import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import FileUpload from "../components/ui/FileUpload.jsx";
import FolderUpload from "../components/ui/FolderUpload.jsx";
import ArtworkForm from "../components/ui/ArtworkForm.jsx";

const AddArtwork = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [uploadMode, setUploadMode] = useState("files"); // 'files' or 'folder'
  const [folderData, setFolderData] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    artworkType: "original",
    medium: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
      unit: "cm",
    },
    price: {
      amount: "",
      currency: "INR",
      negotiable: false,
    },
    quantity: 1,
    tags: "",
    yearCreated: "",
    style: "",
    technique: "",
    location: {
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
    },
    shipping: {
      available: true,
      cost: 0,
      methods: ["standard"],
    },
    files: [],
    availability: "draft",
  });

  const categories = {
    visual_art: {
      label: "Visual Art",
      subcategories: [
        "Painting",
        "Drawing",
        "Illustration",
        "Mixed Media",
        "Collage",
        "Street Art",
      ],
    },
    photography: {
      label: "Photography",
      subcategories: [
        "Portrait",
        "Landscape",
        "Abstract",
        "Documentary",
        "Fashion",
        "Wildlife",
      ],
    },
    digital_art: {
      label: "Digital Art",
      subcategories: [
        "Digital Painting",
        "3D Art",
        "Animation",
        "Concept Art",
        "Graphic Design",
        "NFT",
      ],
    },
    "3d_model": {
      label: "3D Models",
      subcategories: [
        "Characters",
        "Environments",
        "Props",
        "Vehicles",
        "Architecture",
        "Abstract",
        "Game Assets",
        "Printable Models",
      ],
    },
    sculpture: {
      label: "Sculpture",
      subcategories: [
        "Clay",
        "Metal",
        "Wood",
        "Stone",
        "Glass",
        "Mixed Materials",
      ],
    },
    music: {
      label: "Music",
      subcategories: [
        "Original Song",
        "Instrumental",
        "Beat/Loop",
        "Sound Effect",
        "Podcast",
        "Voice Over",
      ],
    },
    video: {
      label: "Video",
      subcategories: [
        "Short Film",
        "Animation",
        "Music Video",
        "Documentary",
        "Commercial",
        "Art Video",
      ],
    },
    other: {
      label: "Other",
      subcategories: [
        "Craft",
        "Textile",
        "Jewelry",
        "Ceramics",
        "Performance Art",
        "Installation",
      ],
    },
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFilesChange = (files) => {
    setFormData((prev) => ({ ...prev, files }));
  };

  const handleFolderUploaded = (folder) => {
    setFolderData(folder);
    setFormData((prev) => ({ ...prev, files: folder.files }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim())
        newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.subcategory)
        newErrors.subcategory = "Subcategory is required";
      if (!formData.medium.trim()) newErrors.medium = "Medium is required";
      if (!formData.price.amount || formData.price.amount <= 0) {
        newErrors["price.amount"] = "Price must be greater than 0";
      }
    }

    if (step === 2) {
      if (!formData.price.amount || formData.price.amount <= 0) {
        newErrors["price.amount"] = "Price must be greater than 0";
      }
      if (formData.files.length === 0 && !folderData) {
        newErrors.files = "At least one file or folder is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validateStep(2)) return;

    setLoading(true);
    setErrors({});

    try {
      let response;

      if (uploadMode === "folder" && folderData) {
        // Create artwork from folder
        const submitData = {
          ...formData,
          availability: isDraft ? "draft" : "available",
          folderData: folderData,
        };
        response = await api.post("/artworks/create-from-folder", submitData);
      } else {
        // Create artwork with individual files
        const submitData = {
          ...formData,
          availability: isDraft ? "draft" : "available",
        };
        response = await api.post("/artworks", submitData);
      }

      if (response.data.success) {
        setSuccessMessage(
          isDraft
            ? "Artwork saved as draft successfully!"
            : "Artwork published successfully!"
        );

        setTimeout(() => {
          navigate("/my-artworks");
        }, 2000);
      }
    } catch (err) {
      console.error("Submit error:", err);
      const errorMsg = err.response?.data?.msg || "Failed to save artwork";
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="super-add-artwork-page">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to add artwork.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="super-add-artwork-page">
      <div className="super-add-header">
        <div className="add-header-icon">🎨</div>
        <div className="add-header-content">
          <h1>Create New Artwork</h1>
          <p>Share your creative masterpiece with the world</p>
        </div>
        <div className="add-progress">
          <div className="progress-step">
            <span className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</span>
            <span className="step-label">Details</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <span className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</span>
            <span className="step-label">Files & Upload</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="super-success-message">
          <div className="success-icon">✅</div>
          <div className="success-content">
            <h4>Success!</h4>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="super-error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{errors.general}</p>
          </div>
        </div>
      )}

      <div className="super-add-content">
        {currentStep === 1 && (
          <>
            <ArtworkForm
              formData={formData}
              categories={categories}
              errors={errors}
              onChange={handleInputChange}
            />

            {/* Super Pricing Section */}
            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">💰</span>
                <h4>Pricing & Sales Details</h4>
                <span className="section-subtitle">Set your artwork's value and availability</span>
              </div>

              <div className="super-form-group">
                <label htmlFor="price.amount" className="super-label">
                  <span className="label-text">Selling Price</span>
                  <span className="required-star">*</span>
                </label>

                <div className="super-price-container">
                  <div className="select-wrapper currency-select-wrapper">
                    <select
                      name="price.currency"
                      value={formData.price.currency}
                      onChange={handleInputChange}
                      className="super-form-select currency-select"
                    >
                      <option value="INR">🇮🇳 INR</option>
                      <option value="USD">🇺🇸 USD</option>
                      <option value="EUR">🇪🇺 EUR</option>
                      <option value="GBP">🇬🇧 GBP</option>
                      <option value="CAD">🇨🇦 CAD</option>
                      <option value="AUD">�� AUIND</option>
                    </select>
                    <div className="select-icon">💱</div>
                  </div>

                  <div className="input-wrapper price-input-wrapper">
                    <input
                      id="price.amount"
                      type="number"
                      name="price.amount"
                      value={formData.price.amount}
                      onChange={handleInputChange}
                      className={`super-form-input ${errors["price.amount"] ? "error" : ""}`}
                      placeholder="Enter your price..."
                      min="0"
                      step="0.01"
                    />
                    <div className="input-icon">💰</div>
                  </div>
                </div>

                {formData.price.amount && (
                  <div className="price-preview">
                    <span className="preview-label">Preview:</span>
                    <span className="formatted-price">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: formData.price.currency || "INR",
                      }).format(formData.price.amount)}
                    </span>
                  </div>
                )}

                {errors["price.amount"] && (
                  <span className="super-field-error">{errors["price.amount"]}</span>
                )}
              </div>

              <div className="super-form-row">
                <div className="super-form-group">
                  <label className="super-checkbox-label">
                    <input
                      type="checkbox"
                      name="price.negotiable"
                      checked={formData.price.negotiable}
                      onChange={handleInputChange}
                    />
                    <span className="super-checkbox"></span>
                    <div className="checkbox-content">
                      <span className="checkbox-title">💬 Open to Negotiation</span>
                      <span className="checkbox-desc">Allow buyers to make offers</span>
                    </div>
                  </label>
                </div>

                <div className="super-form-group">
                  <label htmlFor="quantity" className="super-label">
                    <span className="label-text">Quantity Available</span>
                  </label>
                  <div className="super-quantity-wrapper">
                    <button
                      type="button"
                      className="quantity-btn decrease"
                      onClick={() => {
                        const newQty = Math.max(1, (formData.quantity || 1) - 1);
                        handleInputChange({
                          target: { name: "quantity", value: newQty, type: "number" },
                        });
                      }}
                    >
                      −
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="super-quantity-input"
                      min="1"
                      max="999"
                    />
                    <button
                      type="button"
                      className="quantity-btn increase"
                      onClick={() => {
                        const newQty = Math.min(999, (formData.quantity || 1) + 1);
                        handleInputChange({
                          target: { name: "quantity", value: newQty, type: "number" },
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="help-text">
                    <span className="help-icon">📦</span>
                    How many copies or pieces are available?
                  </div>
                </div>
              </div>

              {/* Price Suggestions */}
              {formData.category && (
                <div className="super-form-group">
                  <label className="super-label">
                    <span className="label-text">💡 Pricing Suggestions</span>
                  </label>
                  <div className="price-suggestions">
                    <button
                      type="button"
                      className="suggestion-btn"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "price.amount", value: "50", type: "number" },
                        })
                      }
                    >
                      ₹50 - Starter
                    </button>
                    <button
                      type="button"
                      className="suggestion-btn"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "price.amount", value: "150", type: "number" },
                        })
                      }
                    >
                      ₹150 - Popular
                    </button>
                    <button
                      type="button"
                      className="suggestion-btn"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "price.amount", value: "300", type: "number" },
                        })
                      }
                    >
                      ₹300 - Premium
                    </button>
                    <button
                      type="button"
                      className="suggestion-btn"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "price.amount", value: "500", type: "number" },
                        })
                      }
                    >
                      ₹500+ - Luxury
                    </button>
                  </div>
                  <div className="help-text">
                    <span className="help-icon">💡</span>
                    These are general suggestions. Price based on your artwork's uniqueness and market demand.
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">📁</span>
                <h4>Upload Method</h4>
                <span className="section-subtitle">Choose how to upload your artwork files</span>
              </div>

              <div className="upload-mode-selector">
                <div className="mode-buttons">
                  <button
                    type="button"
                    className={`super-mode-btn ${uploadMode === "files" ? "active" : ""}`}
                    onClick={() => setUploadMode("files")}
                  >
                    <span className="mode-icon">📁</span>
                    <div className="mode-content">
                      <span className="mode-title">Upload Files</span>
                      <span className="mode-desc">Select individual files</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`super-mode-btn ${uploadMode === "folder" ? "active" : ""}`}
                    onClick={() => setUploadMode("folder")}
                  >
                    <span className="mode-icon">📂</span>
                    <div className="mode-content">
                      <span className="mode-title">Upload Folder</span>
                      <span className="mode-desc">Upload entire folder structure</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {uploadMode === "files" ? (
              <FileUpload
                files={formData.files}
                onChange={handleFilesChange}
                error={errors.files}
              />
            ) : (
              <FolderUpload
                onFolderUploaded={handleFolderUploaded}
                disabled={loading}
              />
            )}

            <div className="super-form-section">
              <div className="section-header">
                <span className="section-icon">🚚</span>
                <h4>Shipping & Additional Options</h4>
                <span className="section-subtitle">Configure delivery and extra services</span>
              </div>

              <div className="super-form-group">
                <label className="super-checkbox-label">
                  <input
                    type="checkbox"
                    name="shipping.available"
                    checked={formData.shipping.available}
                    onChange={handleInputChange}
                  />
                  <span className="super-checkbox"></span>
                  <div className="checkbox-content">
                    <span className="checkbox-title">🚚 Shipping Available</span>
                    <span className="checkbox-desc">Offer shipping to buyers</span>
                  </div>
                </label>
              </div>

              {formData.shipping.available && (
                <div className="super-form-group">
                  <label htmlFor="shipping.cost" className="super-label">
                    <span className="label-text">Shipping Cost</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="shipping.cost"
                      type="number"
                      name="shipping.cost"
                      value={formData.shipping.cost}
                      onChange={handleInputChange}
                      className="super-form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div className="input-icon">💰</div>
                  </div>
                  <div className="help-text">
                    <span className="help-icon">💡</span>
                    Set to 0 for free shipping
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="super-add-actions">
        <div className="actions-container">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="super-btn super-btn-secondary compact"
              disabled={loading}
            >
              <span className="btn-icon">←</span>
              <span className="btn-text">Previous</span>
            </button>
          )}

          <div className="actions-right">
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="super-btn super-btn-primary compact"
              >
                <span className="btn-text">Next Step</span>
                <span className="btn-icon">→</span>
              </button>
            ) : (
              <div className="final-actions">
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  className="super-btn super-btn-draft compact"
                  disabled={loading}
                >
                  <span className="btn-icon">📝</span>
                  <span className="btn-text">{loading ? "Saving..." : "Save as Draft"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  className={`super-btn super-btn-primary compact ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span className="btn-text">Publishing...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      <span className="btn-text">Publish Artwork</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddArtwork;
