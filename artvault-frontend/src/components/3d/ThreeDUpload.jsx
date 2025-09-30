import React, { useState, useRef } from 'react';
import Simple3DViewer from './Simple3DViewer';

const ThreeDUpload = ({ onFilesSelected, maxFiles = 5, className = '' }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Supported 3D file formats
  const supportedFormats = {
    '.fbx': 'FBX (Autodesk)',
    '.obj': 'OBJ (Wavefront)',
    '.blend': 'Blender File',
    '.dae': 'COLLADA',
    '.3ds': '3D Studio',
    '.ply': 'Stanford PLY',
    '.stl': 'STL (Stereolithography)',
    '.gltf': 'glTF 2.0',
    '.glb': 'glTF Binary',
    '.x3d': 'X3D',
    '.ma': 'Maya ASCII',
    '.mb': 'Maya Binary'
  };

  const getFileFormat = (filename) => {
    const extension = '.' + filename.split('.').pop().toLowerCase();
    return supportedFormats[extension] || 'Unknown Format';
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const isSupported3DFile = (file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return Object.keys(supportedFormats).includes(extension);
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(isSupported3DFile);
    
    if (validFiles.length === 0) {
      alert('Please select valid 3D model files');
      return;
    }

    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);

    // Create preview URLs for supported formats
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      format: getFileExtension(file.name),
      name: file.name,
      size: file.size,
      formatName: getFileFormat(file.name)
    }));

    setPreviews(prev => [...prev, ...newPreviews]);

    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].url);
    }
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    if (onFilesSelected) {
      onFilesSelected(newFiles);
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
    <div className={`threed-upload ${className}`}>
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
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
          accept=".fbx,.obj,.blend,.dae,.3ds,.ply,.stl,.gltf,.glb,.x3d,.ma,.mb"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">🎯</div>
          <h3>Upload 3D Models</h3>
          <p>Drag and drop your 3D files here, or click to browse</p>
          <div className="supported-formats">
            <strong>Supported formats:</strong>
            <div className="format-list">
              {Object.entries(supportedFormats).map(([ext, name]) => (
                <span key={ext} className="format-tag">
                  {ext.replace('.', '').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <small>Maximum {maxFiles} files, up to 100MB each</small>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="file-previews">
          <h4>Selected 3D Models ({previews.length})</h4>
          <div className="preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <div className="preview-header">
                  <span className="file-name">{preview.name}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="preview-viewer">
                  <Simple3DViewer
                    fileUrl={preview.url}
                    format={preview.format}
                    className="preview-3d"
                    showControls={false}
                    autoRotate={true}
                  />
                </div>
                
                <div className="file-info">
                  <div className="info-row">
                    <span>Format:</span>
                    <span>{preview.formatName}</span>
                  </div>
                  <div className="info-row">
                    <span>Size:</span>
                    <span>{formatFileSize(preview.size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDUpload;