import React, { useState } from 'react';
import Simple3DViewer from '../components/3d/Simple3DViewer.jsx';
import ThreeDUpload from '../components/3d/ThreeDUpload.jsx';
import ThreeDFilters from '../components/filters/ThreeDFilters.jsx';
import Test3DUpload from '../components/Test3DUpload.jsx';

const Test3D = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filters, setFilters] = useState({});

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    console.log('Selected 3D files:', files);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('3D Filters changed:', newFilters);
  };

  // Sample 3D model URLs for testing (you can replace with actual URLs)
  const sampleModels = [
    {
      name: 'Sample GLTF Model',
      url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      format: 'gltf'
    },
    {
      name: 'Sample GLB Model', 
      url: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
      format: 'glb'
    }
  ];

  return (
    <div className="test-3d-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🎲 3D Model Support Test Page</h1>
      
      <div className="test-section" style={{ marginBottom: '40px' }}>
        <h2>Direct 3D File Upload Test</h2>
        <Test3DUpload />
      </div>

      <div className="test-section" style={{ marginBottom: '40px' }}>
        <h2>3D File Upload Component Test</h2>
        <ThreeDUpload
          onFilesSelected={handleFilesSelected}
          maxFiles={3}
          className="test-upload"
        />
        
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Selected Files:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name} ({file.size} bytes) - {file.name.split('.').pop().toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="test-section" style={{ marginBottom: '40px' }}>
        <h2>3D Filters Test</h2>
        <ThreeDFilters
          onFiltersChange={handleFiltersChange}
          className="test-filters"
        />
        
        {Object.keys(filters).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Current Filters:</h3>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="test-section" style={{ marginBottom: '40px' }}>
        <h2>3D Viewer Test</h2>
        <p>Testing with sample 3D models from Three.js examples:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {sampleModels.map((model, index) => (
            <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
              <h3>{model.name}</h3>
              <Simple3DViewer
                fileUrl={model.url}
                format={model.format}
                className="test-viewer"
                showControls={true}
                autoRotate={true}
              />
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Format: {model.format.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section" style={{ marginBottom: '40px' }}>
        <h2>Supported 3D Formats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { ext: 'GLTF', desc: 'GL Transmission Format', support: '✅ Full Support' },
            { ext: 'GLB', desc: 'GLTF Binary', support: '✅ Full Support' },
            { ext: 'FBX', desc: 'Autodesk FBX', support: '⚠️ Limited Support' },
            { ext: 'OBJ', desc: 'Wavefront OBJ', support: '⚠️ Basic Support' },
            { ext: 'BLEND', desc: 'Blender File', support: '❌ Preview Only' },
            { ext: 'DAE', desc: 'COLLADA', support: '❌ Preview Only' },
            { ext: '3DS', desc: '3D Studio', support: '❌ Preview Only' },
            { ext: 'STL', desc: 'Stereolithography', support: '❌ Preview Only' },
          ].map((format, index) => (
            <div key={index} style={{ 
              padding: '12px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                {format.ext}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                {format.desc}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '500' }}>
                {format.support}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-info" style={{ 
        background: '#f0f8ff', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h3>🔧 Implementation Notes</h3>
        <ul>
          <li><strong>GLTF/GLB:</strong> Full 3D viewer support with materials, animations, and lighting</li>
          <li><strong>FBX:</strong> Requires additional loader, may have compatibility issues</li>
          <li><strong>Other formats:</strong> Show as placeholders with format info</li>
          <li><strong>File upload:</strong> All formats accepted, stored with metadata</li>
          <li><strong>Filtering:</strong> Works with all format types and properties</li>
          <li><strong>Backend:</strong> Updated to handle 3D file types and metadata</li>
        </ul>
      </div>
    </div>
  );
};

export default Test3D;