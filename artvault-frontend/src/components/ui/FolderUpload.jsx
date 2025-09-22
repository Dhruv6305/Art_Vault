import React, { useState, useRef } from "react";

const FolderUpload = ({ onFolderUploaded, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [folderData, setFolderData] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (items) {
      handleFolderDrop(items);
    }
  };

  const handleFolderDrop = async (items) => {
    const files = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await traverseFileTree(entry, "", files);
        }
      }
    }

    if (files.length > 0) {
      uploadFolder(files);
    }
  };

  const traverseFileTree = (item, path, files) => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file) => {
          file.webkitRelativePath = path + file.name;
          files.push(file);
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries) => {
          for (let entry of entries) {
            await traverseFileTree(entry, path + item.name + "/", files);
          }
          resolve();
        });
      }
    });
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFolder(files);
    }
  };

  const uploadFolder = async (files) => {
    setUploadStatus("uploading");
    setError("");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const folderName = `folder_${Date.now()}`;

      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folderName", folderName);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/artwork/upload-folder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus("success");
        setFolderData(data.folder);
        setUploadProgress(100);

        if (onFolderUploaded) {
          onFolderUploaded(data.folder);
        }
      } else {
        throw new Error(data.msg || "Upload failed");
      }
    } catch (err) {
      setUploadStatus("error");
      setError(err.message);
      console.error("Folder upload error:", err);
    }
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setFolderData(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="folder-upload-container">
      {uploadStatus === "idle" && (
        <div
          className={`folder-upload-area ${isDragging ? "dragging" : ""} ${
            disabled ? "disabled" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            webkitdirectory=""
            directory=""
            onChange={handleFileInputChange}
            style={{ display: "none" }}
            disabled={disabled}
          />

          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>Upload Folder</h3>
            <p>Drag and drop a folder here, or click to select</p>
            <p className="upload-note">
              All files in the folder will be uploaded while maintaining the
              folder structure
            </p>
          </div>
        </div>
      )}

      {uploadStatus === "uploading" && (
        <div className="upload-progress">
          <div className="progress-header">
            <span className="upload-icon">⬆️</span>
            <span>Uploading folder...</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p>{uploadProgress}% complete</p>
        </div>
      )}

      {uploadStatus === "success" && folderData && (
        <div className="upload-success">
          <div className="success-header">
            <span className="success-icon">✅</span>
            <span>Folder uploaded successfully!</span>
            <button onClick={resetUpload} className="reset-btn">
              ❌
            </button>
          </div>

          <div className="folder-info">
            <div className="info-item">
              <span className="info-icon">📄</span>
              <span>{folderData.totalFiles} files</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📁</span>
              <span>{formatFileSize(folderData.folderSize)}</span>
            </div>
          </div>

          <div className="file-list">
            <h4>Files in folder:</h4>
            <div className="files-grid">
              {folderData.files.slice(0, 10).map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">
                    {file.type === "image" && "🖼️"}
                    {file.type === "video" && "🎥"}
                    {file.type === "audio" && "🎵"}
                    {file.type === "document" && "📄"}
                  </div>
                  <span className="file-name" title={file.originalPath}>
                    {file.filename}
                  </span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
              ))}
              {folderData.files.length > 10 && (
                <div className="more-files">
                  +{folderData.files.length - 10} more files
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="upload-error">
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <span>Upload failed</span>
            <button onClick={resetUpload} className="reset-btn">
              ❌
            </button>
          </div>
          <p className="error-message">{error}</p>
          <button onClick={resetUpload} className="retry-btn">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderUpload;
