import React from 'react';

// Simple 3D model placeholder component that doesn't use Three.js
// This avoids potential React Three Fiber compatibility issues
const Simple3DViewer = ({ 
  fileUrl, 
  format, 
  className = '', 
  showControls = true,
  autoRotate = true,
  environment = 'city'
}) => {
  const formatInfo = {
    gltf: { name: 'GLTF', color: '#4CAF50', icon: '🎯' },
    glb: { name: 'GLB', color: '#2196F3', icon: '🎲' },
    fbx: { name: 'FBX', color: '#FF9800', icon: '🎨' },
    obj: { name: 'OBJ', color: '#9C27B0', icon: '🔷' },
    blend: { name: 'Blender', color: '#FF5722', icon: '🌀' },
    dae: { name: 'COLLADA', color: '#607D8B', icon: '📐' },
    '3ds': { name: '3DS', color: '#795548', icon: '🏗️' },
    ply: { name: 'PLY', color: '#009688', icon: '🔺' },
    stl: { name: 'STL', color: '#3F51B5', icon: '⚙️' },
    x3d: { name: 'X3D', color: '#E91E63', icon: '🌐' },
    ma: { name: 'Maya ASCII', color: '#00BCD4', icon: '🎭' },
    mb: { name: 'Maya Binary', color: '#CDDC39', icon: '🎪' }
  };

  const info = formatInfo[format?.toLowerCase()] || { 
    name: format?.toUpperCase() || '3D', 
    color: '#666', 
    icon: '🎲' 
  };

  return (
    <div className={`simple-3d-viewer ${className}`}>
      <div className="viewer-container">
        <div 
          className="model-placeholder"
          style={{ 
            background: `linear-gradient(135deg, ${info.color}20, ${info.color}40)`,
            border: `2px solid ${info.color}60`
          }}
        >
          <div className="model-icon" style={{ fontSize: '48px' }}>
            {info.icon}
          </div>
          <div className="model-info">
            <h3>{info.name} Model</h3>
            <p>3D Model Preview</p>
            {autoRotate && (
              <div className="rotation-indicator">
                <span className="rotating-icon">🔄</span>
                <small>Auto-rotating</small>
              </div>
            )}
          </div>
          
          {fileUrl && (
            <div className="model-actions">
              <button 
                className="preview-btn"
                onClick={() => window.open(fileUrl, '_blank')}
                title="Download model file"
              >
                📥 Download
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showControls && (
        <div className="viewer-controls">
          <div className="format-badge" style={{ backgroundColor: info.color }}>
            {info.name}
          </div>
          <div className="control-hints">
            <span>🎲 3D Model</span>
            <span>📁 {format?.toUpperCase()} Format</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simple3DViewer;