import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import FileUpload from "../components/ui/FileUpload.jsx";
import ArtworkForm from "../components/ui/ArtworkForm.jsx";
import DebugArtwork from "../components/DebugArtwork.jsx";

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
      <div className="add-artwork-page">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to add artwork.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-artwork-page">
      <DebugArtwork />
      
        <div className="add-artwork-content">
          {currentStep === 1 && (
            <>
              <ArtworkForm
                formData={formData}
                categories={categories}
                errors={errors}
                onChange={handleInputChange}
              />

              {/* Enhanced Pricing Section */}
              <div className="enhanced-pricing-section">
                <div className="pricing-header">
                  <h3>💰 Pricing & Sales Details</h3>
                  <p className="pricing-subtitle">
                    Set your artwork's price and availability
                  </p>
                </div>

                <div className="pricing-content">
                  {/* Main Price Input */}
                  <div className="price-main-group">
                    <label htmlFor="price.amount" className="price-label">
                      <span className="label-text">Selling Price *</span>
                      <span className="label-hint">
                        Set a competitive price for your artwork
                      </span>
                    </label>

                    <div className="price-input-container">
                      <div className="currency-wrapper">
                        <select
                          name="price.currency"
                          value={formData.price.currency}
                          onChange={handleInputChange}
                          className="currency-select"
                        >
                          <option value="INR">🇮🇳 INR</option>
                          <option value="USD">🇺🇸 USD</option>
                          <option value="EUR">🇪🇺 EUR</option>
                          <option value="GBP">🇬🇧 GBP</option>
                          <option value="CAD">🇨🇦 CAD</option>
                          <option value="AUD">🇦🇺 AUD</option>
                        </select>
                      </div>

                      <div className="price-input-wrapper">
                        <input
                          id="price.amount"
                          type="number"
                          name="price.amount"
                          value={formData.price.amount}
                          onChange={handleInputChange}
                          className={`price-input ${
                            errors["price.amount"] ? "error" : ""
                          }`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <div className="price-display">
                          {formData.price.amount && (
                            <span className="formatted-price">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: formData.price.currency || "INR",
                              }).format(formData.price.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {errors["price.amount"] && (
                      <div className="field-error">
                        <span className="error-icon">⚠️</span>
                        {errors["price.amount"]}
                      </div>
                    )}
                  </div>

                  {/* Pricing Options */}
                  <div className="pricing-options">
                    <div className="pricing-row">
                      <div className="option-group">
                        <label className="modern-checkbox">
                          <input
                            type="checkbox"
                            name="price.negotiable"
                            checked={formData.price.negotiable}
                            onChange={handleInputChange}
                          />
                          <span className="checkbox-custom"></span>
                          <div className="checkbox-content">
                            <span className="checkbox-title">
                              💬 Open to Negotiation
                            </span>
                            <span className="checkbox-desc">
                              Allow buyers to make offers
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="option-group">
                        <label htmlFor="quantity" className="quantity-label">
                          <span className="label-text">
                            📦 Quantity Available
                          </span>
                          <span className="label-hint">
                            How many copies/pieces?
                          </span>
                        </label>
                        <div className="quantity-input-wrapper">
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => {
                              const newQty = Math.max(
                                1,
                                (formData.quantity || 1) - 1
                              );
                              handleInputChange({
                                target: {
                                  name: "quantity",
                                  value: newQty,
                                  type: "number",
                                },
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
                            className="quantity-input"
                            min="1"
                            max="999"
                          />
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => {
                              const newQty = Math.min(
                                999,
                                (formData.quantity || 1) + 1
                              );
                              handleInputChange({
                                target: {
                                  name: "quantity",
                                  value: newQty,
                                  type: "number",
                                },
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price Suggestions */}
                    {formData.category && (
                      <div className="price-suggestions">
                        <h4>💡 Pricing Suggestions</h4>
                        <div className="suggestion-buttons">
                          <button
                            type="button"
                            className="suggestion-btn"
                            onClick={() =>
                              handleInputChange({
                                target: {
                                  name: "price.amount",
                                  value: "50",
                                  type: "number",
                                },
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
                                target: {
                                  name: "price.amount",
                                  value: "150",
                                  type: "number",
                                },
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
                                target: {
                                  name: "price.amount",
                                  value: "300",
                                  type: "number",
                                },
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
                                target: {
                                  name: "price.amount",
                                  value: "500",
                                  type: "number",
                                },
                              })
                            }
                          >
                            ₹500+ - Luxury
                          </button>
                        </div>
                        <p className="suggestion-note">
                          💡 These are general suggestions. Price based on your
                          artwork's uniqueness, size, and market demand.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <div className="upload-mode-selector">
                <h3>Upload Method</h3>
                <div className="mode-buttons">
                  <button
                    type="button"
                    className={`mode-btn ${
                      uploadMode === "files" ? "active" : ""
                    }`}
                    onClick={() => setUploadMode("files")}
                  >
                    Individual Files
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${
                      uploadMode === "folder" ? "active" : ""
                    }`}
                    onClick={() => setUploadMode("folder")}
                  >
                    Entire Folder
                  </button>
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

              <div className="pricing-section">
                <h3>Pricing & Availability</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price.amount">Price *</label>
                    <div className="price-input">
                      <select
                        name="price.currency"
                        value={formData.price.currency}
                        onChange={handleInputChange}
                        className="currency-select"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                      </select>
                      <input
                        id="price.amount"
                        type="number"
                        name="price.amount"
                        value={formData.price.amount}
                        onChange={handleInputChange}
                        className={`form-input ${
                          errors["price.amount"] ? "error" : ""
                        }`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors["price.amount"] && (
                      <span className="field-error">
                        {errors["price.amount"]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="price.negotiable"
                      checked={formData.price.negotiable}
                      onChange={handleInputChange}
                    />
                    Price is negotiable  
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="shipping.available"
                      checked={formData.shipping.available}
                      onChange={handleInputChange}
                    />
                    Shipping available
                  </label>
                </div>

                {formData.shipping.available && (
                  <div className="form-group">
                    <label htmlFor="shipping.cost">Shipping Cost</label>
                    <input
                      id="shipping.cost"
                      type="number"
                      name="shipping.cost"
                      value={formData.shipping.cost}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="add-artwork-actions">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="btn btn-secondary"
              disabled={loading}
            >
              ← Previous
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next →
            </button>
          ) : (
            <div className="final-actions">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="btn btn-secondary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Publishing...
                  </>
                ) : (
                  "Publish Artwork"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default AddArtwork;
