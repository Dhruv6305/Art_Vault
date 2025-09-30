import React, { useState, useRef } from 'react';
import api from '../../api/axios.js';

const FolderUpload = ({ onFolderUploaded, disabled = false, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (disabled || uploading) return;

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Add all files to FormData
      Array.from(files).forEach((file, index) => {
        formData.append('files', file);
        // Preserve folder structure by adding the webkitRelativePath
        if (file.webkitRelativePath) {
          formData.append(`paths[${index}]`, file.webkitRelativePath);
        }
      });

      const response = await api.post('/artworks/upload-folder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        const folderData = {
          files: response.data.files,
          folderPath: response.data.folderPath,
          totalFiles: response.data.files.length,
          folderSize: response.data.files.reduce((sum, file) => sum + (file.size || 0), 0),
        };

        if (onFolderUploaded) {
          onFolderUploaded(folderData);
        }
      } else {
        setError(response.data.msg || 'Upload failed');
      }
    } catch (err) {
      console.error('Folder upload error:', err);
      setError(err.response?.data?.msg || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`folder-upload ${className}`}>
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        
        <div className="upload-content">
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-icon">📁</div>
              <h3>Uploading Folder...</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>{uploadProgress}% complete</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📂</div>
              <h3>Upload Entire Folder</h3>
              <p>Select a folder to upload all files at once</p>
              <div className="upload-features">
                <div className="feature">
                  <span className="feature-icon">🗂️</span>
                  <span>Preserves folder structure</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📁</span>
                  <span>Supports nested folders</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🚀</span>
                  <span>Bulk upload multiple files</span>
                </div>
              </div>
              <small>Click to browse or drag and drop a folder here</small>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="upload-error">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      <div className="upload-info">
        <h4>📋 Folder Upload Guidelines</h4>
        <ul>
          <li>Maximum 100 files per folder</li>
          <li>Each file must be under 100MB</li>
          <li>Supported formats: Images, Videos, Audio, Documents, 3D Models</li>
          <li>Folder structure will be preserved</li>
          <li>All files will be associated with this artwork</li>
        </ul>
      </div>
    </div>
  );
};

export default FolderUpload;