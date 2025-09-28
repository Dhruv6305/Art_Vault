import React, { useState, useRef } from "react";
import api from "../../api/axios.js";

const FileUpload = ({ files, onChange, error }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedTypes = {
    image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/webm"],
    audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/mpeg"],
    document: ["application/pdf"],
  };

  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const validateFile = (file) => {
    const allAcceptedTypes = Object.values(acceptedTypes).flat();

    if (!allAcceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    if (file.size > maxFileSize) {
      return `File size must be less than 100MB`;
    }

    return null;
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  };

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    // Validate each file
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert("Some files were rejected:\n" + errors.join("\n"));
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post("/artworks/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const uploadedFiles = response.data.files.map((file, index) => ({
          ...file,
          originalFile: validFiles[index],
          preview:
            file.type === "image"
              ? URL.createObjectURL(validFiles[index])
              : null,
        }));

        onChange([...files, ...uploadedFiles]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const setPrimaryFile = (index) => {
    const newFiles = files.map((file, i) => ({
      ...file,
      isPrimary: i === index,
    }));
    onChange(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      case "document":
        return "📄";
      default:
        return "📁";
    }
  };

  return (
    <div className="file-upload-section">
      <h3>Upload Media Files</h3>

      <div
        className={`file-upload-area ${dragActive ? "drag-active" : ""} ${
          error ? "error" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <div className="upload-content">
          {uploading ? (
            <div className="uploading">
              <span className="spinner"></span>
              <p>Uploading files...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <h4>Drop files here or click to browse</h4>
              <p>
                Supported formats: Images (JPG, PNG, GIF, WebP), Videos (MP4,
                AVI, MOV, WebM), Audio (MP3, WAV, OGG, M4A), Documents (PDF)
              </p>
              <p className="file-limit">Maximum file size: 100MB</p>
            </>
          )}
        </div>
      </div>

      {error && <span className="field-error">{error}</span>}

      {files.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files ({files.length})</h4>
          <div className="files-grid">
            {files.map((file, index) => (
              <div
                key={index}
                className={`file-item ${file.isPrimary ? "primary" : ""}`}
              >
                <div className="file-preview">
                  {file.type === "image" && file.preview ? (
                    <img src={file.preview} alt={file.filename} />
                  ) : (
                    <div className="file-icon">{getFileIcon(file.type)}</div>
                  )}
                  {file.isPrimary && (
                    <div className="primary-badge">Primary</div>
                  )}
                </div>

                <div className="file-info">
                  <div className="file-name" title={file.filename}>
                    {file.filename}
                  </div>
                  <div className="file-details">
                    <span className="file-type">{file.type}</span>
                    <span className="file-size">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>

                <div className="file-actions">
                  {!file.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryFile(index)}
                      className="btn-icon"
                      title="Set as primary"
                    >
                      ⭐
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="btn-icon remove"
                    title="Remove file"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="upload-help">
            <p>
              💡 <strong>Tip:</strong> Click the star icon to set a primary file
              that will be displayed as the main preview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
