import React, { useState, useEffect } from "react";
import {
  threeDCategories,
  getSubcategoriesForCategory,
  getSupportedFormatsForSubcategory,
  getFormatInfo,
} from "../../utils/3dCategories.js";
import ThreeDViewer from "./ThreeDViewer.jsx";
import api from "../../api/axios.js";

const ThreeDForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "3d_model",
    subcategory: "",
    artworkType: "digital",
    medium: "digital_3d",
    price: "",
    quantity: 1,
    tags: [],
    yearCreated: new Date().getFullYear(),
    style: "",
    technique: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
      unit: "cm",
    },
    shipping: {
      available: true,
      cost: 0,
      methods: ["standard"],
    },
  });

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({ ...formData, ...initialData });
      setUploadedFiles(initialData.files || []);
    }
  }, [initialData, isEditing]);

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
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Auto-preview first 3D file
    const threeDFile = selectedFiles.find((file) => {
      const ext = file.name.toLowerCase().split(".").pop();
      return ["gltf", "glb", "fbx", "obj"].includes(ext);
    });

    if (threeDFile) {
      const fileUrl = URL.createObjectURL(threeDFile);
      setPreviewFile({
        url: fileUrl,
        name: threeDFile.name,
        type: "3d_model",
      });
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      files.forEach((file) => {
        formDataUpload.append("files", file);
      });

      const response = await api.post("/artworks/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedFiles((prev) => [...prev, ...response.data.files]);
        setFiles([]);

        // Set preview to first uploaded 3D file
        const uploaded3D = response.data.files.find(
          (file) => file.type === "3d_model"
        );
        if (uploaded3D) {
          setPreviewFile({
            url: uploaded3D.url.startsWith("http")
              ? uploaded3D.url
              : `http://localhost:5000/${uploaded3D.url}`,
            name: uploaded3D.filename,
            type: "3d_model",
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ upload: "Failed to upload files" });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (uploadedFiles.length === 0)
      newErrors.files = "At least one 3D file is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...formData,
      files: uploadedFiles,
      category: "3d_model",
    };

    onSubmit(submissionData);
  };

  const subcategories = getSubcategoriesForCategory("3d_model");
  const supportedFormats = formData.subcategory
    ? getSupportedFormatsForSubcategory("3d_model", formData.subcategory)
    : [];

  return (
    <div
      className="threed-form"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <h2>{isEditing ? "Edit 3D Artwork" : "Upload 3D Artwork"}</h2>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}
      >
        {/* Form Section */}
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter artwork title"
                className={errors.title ? "error" : ""}
              />
              {errors.title && (
                <span className="error-text">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your 3D artwork..."
                rows="4"
                className={errors.description ? "error" : ""}
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            {/* Category Selection */}
            <div className="form-group">
              <label>Subcategory *</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className={errors.subcategory ? "error" : ""}
              >
                <option value="">Select a subcategory</option>
                {Object.entries(subcategories).map(([key, sub]) => (
                  <option key={key} value={key}>
                    {sub.icon} {sub.name}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <span className="error-text">{errors.subcategory}</span>
              )}

              {formData.subcategory && (
                <div
                  className="subcategory-info"
                  style={{
                    marginTop: "8px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  <strong>{subcategories[formData.subcategory]?.name}</strong>
                  <p style={{ margin: "5px 0", color: "#666" }}>
                    {subcategories[formData.subcategory]?.description}
                  </p>
                  <div>
                    <strong>Recommended formats:</strong>{" "}
                    {supportedFormats.join(", ").toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>3D Files *</label>
              <input
                type="file"
                multiple
                accept=".fbx,.obj,.blend,.dae,.3ds,.ply,.stl,.gltf,.glb,.x3d,.ma,.mb"
                onChange={handleFileChange}
                style={{ marginBottom: "10px" }}
              />

              {files.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={uploading}
                    style={{
                      padding: "8px 16px",
                      background: uploading ? "#ccc" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: uploading ? "not-allowed" : "pointer",
                    }}
                  >
                    {uploading
                      ? "Uploading..."
                      : `Upload ${files.length} file(s)`}
                  </button>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files" style={{ marginTop: "10px" }}>
                  <strong>Uploaded files:</strong>
                  <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                    {uploadedFiles.map((file, index) => (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        {file.filename} ({file.type})
                        {file.type === "3d_model" && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewFile({
                                url: file.url.startsWith("http")
                                  ? file.url
                                  : `http://localhost:5000/${file.url}`,
                                name: file.filename,
                                type: "3d_model",
                              })
                            }
                            style={{
                              marginLeft: "10px",
                              padding: "2px 8px",
                              fontSize: "12px",
                              background: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            Preview
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {errors.files && (
                <span className="error-text">{errors.files}</span>
              )}
            </div>

            {/* Pricing */}
            <div
              className="form-row"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label>Price (USD) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.price ? "error" : ""}
                />
                {errors.price && (
                  <span className="error-text">{errors.price}</span>
                )}
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="form-group">
              <label>Dimensions (Optional)</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 80px",
                  gap: "10px",
                }}
              >
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  placeholder="Width"
                />
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="Height"
                />
                <input
                  type="number"
                  name="dimensions.depth"
                  value={formData.dimensions.depth}
                  onChange={handleInputChange}
                  placeholder="Depth"
                />
                <select
                  name="dimensions.unit"
                  value={formData.dimensions.unit}
                  onChange={handleInputChange}
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>Tags</label>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  style={{ padding: "8px 16px" }}
                >
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div
                  className="tags-display"
                  style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                >
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#e9ecef",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "16px",
                          lineHeight: "1",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div
              className="form-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div className="form-group">
                <label>Style</label>
                <input
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  placeholder="e.g., Realistic, Stylized, Low-poly"
                />
              </div>

              <div className="form-group">
                <label>Technique</label>
                <input
                  type="text"
                  name="technique"
                  value={formData.technique}
                  onChange={handleInputChange}
                  placeholder="e.g., Sculpting, Modeling, Procedural"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Year Created</label>
              <input
                type="number"
                name="yearCreated"
                value={formData.yearCreated}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              {isEditing ? "Update 3D Artwork" : "Create 3D Artwork"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <h3>3D Preview</h3>

          {previewFile ? (
            <div>
              <ThreeDViewer
                fileUrl={previewFile.url}
                fileName={previewFile.name}
                autoRotate={true}
                showControls={true}
                backgroundColor="#1a1a1a"
                modelScale={1}
              />

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <strong>Preview:</strong> {previewFile.name}
                <br />
                <small style={{ color: "#666" }}>
                  Use mouse to rotate, scroll to zoom
                </small>
              </div>
            </div>
          ) : (
            <div
              style={{
                height: "400px",
                background: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: "2px dashed #dee2e6",
                flexDirection: "column",
                color: "#666",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🎲</div>
              <div>Upload a 3D file to see preview</div>
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                Supported: GLTF, GLB, FBX, OBJ
              </div>
            </div>
          )}

          {/* Format Information */}
          {formData.subcategory && (
            <div style={{ marginTop: "20px" }}>
              <h4>Recommended Formats</h4>
              <div style={{ display: "grid", gap: "10px" }}>
                {supportedFormats.slice(0, 4).map((format) => {
                  const formatInfo = getFormatInfo(format);
                  return formatInfo ? (
                    <div
                      key={format}
                      style={{
                        padding: "10px",
                        background: "#f8f9fa",
                        borderRadius: "4px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <strong>{format.toUpperCase()}</strong> -{" "}
                      {formatInfo.name}
                      <br />
                      <small style={{ color: "#666" }}>
                        {formatInfo.description}
                      </small>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeDForm;
