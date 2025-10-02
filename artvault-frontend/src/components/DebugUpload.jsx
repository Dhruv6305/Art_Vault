import React, { useState } from "react";
import api from "../api/axios.js";

const DebugUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);

    if (selectedFile) {
      console.log("📁 File selected:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });
    }
  };

  const testUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🚀 Starting upload test...");

      // Check authentication first
      const token = localStorage.getItem("token");
      console.log("🔑 Token present:", !!token);

      if (!token) {
        throw new Error("No authentication token found. Please log in first.");
      }

      // Create FormData
      const formData = new FormData();
      formData.append("files", file);

      console.log("📦 FormData created with file:", file.name);

      // Make upload request
      console.log("📡 Making upload request...");
      const response = await api.post("/artworks/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload successful:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("❌ Upload failed:", err);

      let errorMessage = "Upload failed: ";
      if (err.response) {
        errorMessage += `${err.response.status} - ${
          err.response.data?.msg || err.response.statusText
        }`;
        console.log("📋 Error response:", err.response.data);
      } else if (err.request) {
        errorMessage += "No response from server";
        console.log("📋 No response received");
      } else {
        errorMessage += err.message;
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log("🔍 Testing server connection...");
      const response = await api.get("/artworks/test");
      console.log("✅ Server connection OK:", response.data);
      setResult({ connectionTest: response.data });
    } catch (err) {
      console.error("❌ Connection test failed:", err);
      setError(`Connection failed: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #333",
        borderRadius: "8px",
        margin: "20px",
        backgroundColor: "#1a1a1a",
        color: "white",
      }}
    >
      <h3>🔧 Upload Debug Tool</h3>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testConnection}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Server Connection
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".gltf,.glb,.fbx,.obj,.stl,.blend,.jpg,.png,.mp4"
          style={{
            padding: "10px",
            backgroundColor: "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
        />
      </div>

      {file && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#333",
            borderRadius: "4px",
          }}
        >
          <h4>📁 Selected File:</h4>
          <p>Name: {file.name}</p>
          <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Type: {file.type}</p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testUpload}
          disabled={!file || uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: file && !uploading ? "#28a745" : "#666",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: file && !uploading ? "pointer" : "not-allowed",
          }}
        >
          {uploading ? "⏳ Uploading..." : "🚀 Test Upload"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#dc3545",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <h4>❌ Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            borderRadius: "4px",
          }}
        >
          <h4>✅ Success:</h4>
          <pre
            style={{
              backgroundColor: "#1a1a1a",
              padding: "10px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#333",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        <h4>📋 Debug Info:</h4>
        <p>• Check browser console for detailed logs</p>
        <p>• Check Network tab in DevTools during upload</p>
        <p>• Make sure you're logged in (token in localStorage)</p>
        <p>• Backend should log upload attempts in console</p>
      </div>
    </div>
  );
};

export default DebugUpload;
