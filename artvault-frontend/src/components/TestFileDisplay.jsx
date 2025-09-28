import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const TestFileDisplay = () => {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      console.log(
        "Uploading files:",
        selectedFiles.map((f) => f.name)
      );

      const response = await api.post("/artworks/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedFiles(response.data.files);
        console.log("Upload successful:", response.data.files);
      } else {
        setError("Upload failed: " + response.data.msg);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = (file, index) => {
    const fileUrl = file.url.startsWith("http")
      ? file.url
      : `http://localhost:5000/${file.url}`;

    console.log(`Rendering file ${index}:`, file.filename, "URL:", fileUrl);

    switch (file.type) {
      case "image":
        return (
          <div key={index} className="file-preview">
            <h4>Image: {file.filename}</h4>
            <img
              src={fileUrl}
              alt={file.filename}
              style={{
                maxWidth: "300px",
                maxHeight: "200px",
                objectFit: "cover",
              }}
              onLoad={() => console.log("Image loaded successfully:", fileUrl)}
              onError={(e) => {
                console.error("Image failed to load:", fileUrl);
                e.target.style.border = "2px solid red";
              }}
            />
            <p>URL: {fileUrl}</p>
          </div>
        );

      case "audio":
        return (
          <div key={index} className="file-preview">
            <h4>Audio: {file.filename}</h4>
            <audio
              controls
              src={fileUrl}
              onLoadedData={() =>
                console.log("Audio loaded successfully:", fileUrl)
              }
              onError={(e) => {
                console.error("Audio failed to load:", fileUrl);
              }}
            >
              Your browser does not support the audio element.
            </audio>
            <p>URL: {fileUrl}</p>
          </div>
        );

      case "video":
        return (
          <div key={index} className="file-preview">
            <h4>Video: {file.filename}</h4>
            <video
              controls
              src={fileUrl}
              style={{ maxWidth: "300px", maxHeight: "200px" }}
              onLoadedData={() =>
                console.log("Video loaded successfully:", fileUrl)
              }
              onError={(e) => {
                console.error("Video failed to load:", fileUrl);
              }}
            >
              Your browser does not support the video element.
            </video>
            <p>URL: {fileUrl}</p>
          </div>
        );

      default:
        return (
          <div key={index} className="file-preview">
            <h4>Document: {file.filename}</h4>
            <a
              href={fileUrl}
              download={file.filename}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download {file.filename}
            </a>
            <p>URL: {fileUrl}</p>
          </div>
        );
    }
  };

  if (!user) {
    return <div>Please log in to test file uploads</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#f8f9fa",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Test File Upload & Display</h3>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          multiple
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <button
          onClick={handleUpload}
          disabled={loading || selectedFiles.length === 0}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>

        {selectedFiles.length > 0 && (
          <span>Selected: {selectedFiles.map((f) => f.name).join(", ")}</span>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "red",
            background: "#f8d7da",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div>
          <h4>Uploaded Files ({uploadedFiles.length}):</h4>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {uploadedFiles.map((file, index) => renderFilePreview(file, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestFileDisplay;
