import React, { useState } from "react";
import api from "../api/axios.js";
import Standard3DCanvas from "./3d/Standard3DCanvas.jsx";

const Create3DArtwork = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Artwork form data
  const [artworkData, setArtworkData] = useState({
    title: "",
    description: "",
    category: "3d_model",
    subcategory: "",
    medium: "",
    price: { amount: "", currency: "USD", negotiable: false },
    tags: "",
    yearCreated: new Date().getFullYear(),
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setSuccess(null);
    setUploadedFiles([]);

    console.log(
      "Selected files:",
      selectedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }))
    );
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      console.log("Uploading files...");

      const response = await api.post("/artworks/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);

      if (response.data.success) {
        setUploadedFiles(response.data.files);
        setSuccess("Files uploaded successfully! Now fill in artwork details.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.msg || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateArtwork = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please upload files first");
      return;
    }

    if (!artworkData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const artworkPayload = {
        ...artworkData,
        files: uploadedFiles,
        price: {
          amount: parseFloat(artworkData.price.amount) || 0,
          currency: artworkData.price.currency,
          negotiable: artworkData.price.negotiable,
        },
      };

      console.log("Creating artwork with payload:", artworkPayload);

      const response = await api.post("/artworks", artworkPayload);

      console.log("Artwork creation response:", response.data);

      if (response.data.success) {
        setSuccess(`Artwork "${artworkData.title}" created successfully!`);

        // Reset form
        setFiles([]);
        setUploadedFiles([]);
        setArtworkData({
          title: "",
          description: "",
          category: "3d_model",
          subcategory: "",
          medium: "",
          price: { amount: "", currency: "USD", negotiable: false },
          tags: "",
          yearCreated: new Date().getFullYear(),
        });
      }
    } catch (err) {
      console.error("Artwork creation error:", err);
      setError(err.response?.data?.msg || err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setArtworkData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setArtworkData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🎨 Create 3D Artwork</h2>

      {/* Step 1: File Upload */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #dee2e6",
        }}
      >
        <h3>📁 Step 1: Upload 3D Files</h3>

        <input
          type="file"
          multiple
          accept=".fbx,.obj,.blend,.dae,.3ds,.ply,.stl,.gltf,.glb,.x3d,.ma,.mb"
          onChange={handleFileChange}
          style={{ marginBottom: "15px", width: "100%" }}
        />

        {files.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <h4>Selected Files:</h4>
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  background: "#e9ecef",
                  padding: "8px",
                  margin: "5px 0",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <strong>{file.name}</strong> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
                <br />
                Extension: .{file.name.split(".").pop().toUpperCase()}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUploadFiles}
          disabled={files.length === 0 || uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: uploading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {/* Step 2: Preview Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div
          style={{
            background: "#d4edda",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          <h3>✅ Step 2: Files Uploaded Successfully</h3>

          {uploadedFiles.map((file, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4>{file.filename}</h4>
              <p>
                Type: {file.type} | Format: {file.format || "N/A"}
              </p>

              {file.type === "3d_model" && (
                <div style={{ marginTop: "10px" }}>
                  <Standard3DCanvas
                    fileUrl={
                      file.url.startsWith("http")
                        ? file.url
                        : `http://localhost:5000/${file.url}`
                    }
                    fileName={file.filename}
                    canvasSize="preview"
                    showControls={true}
                    autoRotate={true}
                    backgroundColor="#1a1a1a"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Artwork Details */}
      {uploadedFiles.length > 0 && (
        <div
          style={{
            background: "#fff3cd",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ffeaa7",
          }}
        >
          <h3>📝 Step 3: Artwork Details</h3>

          <div style={{ display: "grid", gap: "15px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Title *
              </label>
              <input
                type="text"
                value={artworkData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter artwork title"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Description
              </label>
              <textarea
                value={artworkData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your 3D artwork"
                rows={4}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Subcategory
                </label>
                <input
                  type="text"
                  value={artworkData.subcategory}
                  onChange={(e) =>
                    handleInputChange("subcategory", e.target.value)
                  }
                  placeholder="e.g., Character, Environment, Vehicle"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Medium
                </label>
                <input
                  type="text"
                  value={artworkData.medium}
                  onChange={(e) => handleInputChange("medium", e.target.value)}
                  placeholder="e.g., Digital 3D Model, Blender, Maya"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  value={artworkData.price.amount}
                  onChange={(e) =>
                    handleInputChange("price.amount", e.target.value)
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Currency
                </label>
                <select
                  value={artworkData.price.currency}
                  onChange={(e) =>
                    handleInputChange("price.currency", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Year Created
                </label>
                <input
                  type="number"
                  value={artworkData.yearCreated}
                  onChange={(e) =>
                    handleInputChange("yearCreated", parseInt(e.target.value))
                  }
                  min="1900"
                  max={new Date().getFullYear()}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  checked={artworkData.price.negotiable}
                  onChange={(e) =>
                    handleInputChange("price.negotiable", e.target.checked)
                  }
                />
                <span>Price is negotiable</span>
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={artworkData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="3d, model, character, blender, fbx"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleCreateArtwork}
            disabled={creating || !artworkData.title.trim()}
            style={{
              padding: "12px 24px",
              backgroundColor: creating ? "#6c757d" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: creating ? "not-allowed" : "pointer",
              marginTop: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {creating ? "Creating Artwork..." : "Create 3D Artwork"}
          </button>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div
          style={{
            background: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
            marginBottom: "20px",
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "15px",
            borderRadius: "4px",
            border: "1px solid #c3e6cb",
            marginBottom: "20px",
          }}
        >
          <strong>✅ Success:</strong> {success}
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          background: "#e3f2fd",
          padding: "15px",
          borderRadius: "4px",
          border: "1px solid #b3d9ff",
        }}
      >
        <h3>📋 Instructions:</h3>
        <ol style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            <strong>Upload Files:</strong> Select your 3D files (.fbx, .obj,
            .gltf, etc.) and click "Upload Files"
          </li>
          <li>
            <strong>Preview:</strong> Review your uploaded files with 3D
            previews
          </li>
          <li>
            <strong>Fill Details:</strong> Enter artwork title, description,
            price, and other details
          </li>
          <li>
            <strong>Create:</strong> Click "Create 3D Artwork" to publish your
            artwork
          </li>
        </ol>

        <p>
          <strong>Supported formats:</strong> FBX, OBJ, GLTF, GLB, STL, BLEND,
          DAE, 3DS, PLY, X3D, MA, MB
        </p>
      </div>
    </div>
  );
};

export default Create3DArtwork;
