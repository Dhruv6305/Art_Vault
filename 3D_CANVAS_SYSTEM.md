# 🎲 3D Canvas System - Fixed Size 3D Model Viewers

## 🎯 **Overview**

A comprehensive system of standardized 3D model viewers with fixed dimensions for consistent UI across your ArtVault application.

## 📦 **Components Created**

### **1. Standard3DCanvas** - Base Component

- **File:** `artvault-frontend/src/components/3d/Standard3DCanvas.jsx`
- **Purpose:** Core 3D viewer with customizable dimensions
- **Features:**
  - Fixed width/height
  - Interactive controls (drag to rotate, scroll to zoom)
  - Auto-rotation toggle
  - Loading states and error handling
  - Customizable lighting and camera positions

### **2. ThreeDCanvasPresets** - Preset Components

- **File:** `artvault-frontend/src/components/3d/ThreeDCanvasPresets.jsx`
- **Purpose:** Pre-configured canvas sizes for different use cases

### **3. CanvasDemo** - Demonstration

- **File:** `artvault-frontend/src/components/3d/CanvasDemo.jsx`
- **Purpose:** Interactive demo showing all canvas sizes

## 🎨 **Available Canvas Sizes**

| Canvas Type       | Dimensions | Use Case                            | Auto-rotate | Controls |
| ----------------- | ---------- | ----------------------------------- | ----------- | -------- |
| **Thumbnail**     | 150×120    | Lists, search results               | ✅          | ❌       |
| **Card**          | 200×200    | Gallery cards, featured items       | ✅          | ❌       |
| **Preview**       | 250×200    | Upload preview, quick view          | ✅          | ❌       |
| **Small**         | 250×200    | Sidebar previews, compact displays  | ✅          | ✅       |
| **Medium**        | 400×300    | Main artwork display, product pages | ❌          | ✅       |
| **Large**         | 600×450    | Detailed view, full-screen preview  | ❌          | ✅       |
| **Square Small**  | 200×200    | Uniform grid layouts                | ❌          | ✅       |
| **Square Medium** | 300×300    | Portfolio displays                  | ❌          | ✅       |
| **Square Large**  | 400×400    | Featured artwork                    | ❌          | ✅       |
| **Wide**          | 500×280    | Header banners                      | ✅          | ✅       |
| **Ultra Wide**    | 700×300    | Featured sections                   | ✅          | ✅       |
| **Gallery**       | 400×300    | Art galleries, exhibitions          | ❌          | ✅       |

## 💻 **Usage Examples**

### **Basic Import**

```javascript
import {
  Medium3DCanvas,
  Card3DCanvas,
  Gallery3DCanvas,
  Preview3DCanvas,
} from "./components/3d/ThreeDCanvasPresets";
```

### **In Artwork Cards**

```javascript
const ArtworkCard = ({ artwork }) => (
  <div className="artwork-card">
    <Card3DCanvas
      fileUrl={artwork.files[0].url}
      fileName={artwork.files[0].filename}
    />
    <h3>{artwork.title}</h3>
  </div>
);
```

### **In Main Artwork Display**

```javascript
const ArtworkDetail = ({ artwork }) => (
  <div className="artwork-detail">
    <Medium3DCanvas
      fileUrl={artwork.primaryFile.url}
      fileName={artwork.primaryFile.filename}
      autoRotate={false}
      showControls={true}
    />
  </div>
);
```

### **In Upload Preview**

```javascript
const UploadPreview = ({ uploadedFile }) => (
  <div className="upload-preview">
    <Preview3DCanvas fileUrl={uploadedFile.url} fileName={uploadedFile.name} />
  </div>
);
```

### **Custom Configuration**

```javascript
<Standard3DCanvas
  fileUrl="/path/to/model.obj"
  fileName="custom-model.obj"
  width={500}
  height={400}
  autoRotate={true}
  showControls={true}
  backgroundColor="#2a2a2a"
  modelScale={1.2}
  cameraPosition={[0, 2, 6]}
  showInfo={true}
/>
```

## 🎛️ **Configuration Options**

### **Standard3DCanvas Props**

```javascript
{
  fileUrl: string,           // URL to 3D model file
  fileName: string,          // Display name for the file
  width: number,             // Canvas width (default: 400)
  height: number,            // Canvas height (default: 300)
  autoRotate: boolean,       // Enable auto-rotation (default: true)
  showControls: boolean,     // Show interaction controls (default: true)
  backgroundColor: string,   // Background color (default: "#1a1a1a")
  modelScale: number,        // Model scale factor (default: 1)
  cameraPosition: [x,y,z],   // Camera position (default: [0,0,5])
  showInfo: boolean,         // Show info overlay (default: true)
  className: string,         // Additional CSS classes
  style: object             // Additional inline styles
}
```

## 🎨 **Styling & Customization**

### **CSS Classes**

```css
.standard-3d-canvas {
  /* Base canvas styles */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.standard-3d-canvas.error {
  /* Error state styles */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### **Custom Themes**

```javascript
// Dark theme
<Medium3DCanvas
  backgroundColor="#0a0a0a"
  style={{ border: "2px solid #333" }}
/>

// Light theme
<Medium3DCanvas
  backgroundColor="#f5f5f5"
  style={{ border: "2px solid #ddd" }}
/>

// Colorful theme
<Medium3DCanvas
  backgroundColor="#1a237e"
  style={{ border: "2px solid #3f51b5" }}
/>
```

## 🔧 **Integration with Existing Components**

### **Updated Test3DUpload**

- Added canvas size selector
- Shows different canvas sizes in action
- Compares with original SimpleThreeDViewer

### **Updated ThreeDDisplay**

- Imported new canvas presets
- Ready for integration with standardized sizes

## 🚀 **Benefits**

### **Consistency**

- ✅ Fixed dimensions across the entire app
- ✅ Uniform user experience
- ✅ Predictable layout behavior

### **Performance**

- ✅ Optimized rendering for each size
- ✅ Appropriate detail levels
- ✅ Efficient resource usage

### **Maintainability**

- ✅ Single source of truth for 3D viewers
- ✅ Easy to update globally
- ✅ Consistent feature set

### **User Experience**

- ✅ Familiar interaction patterns
- ✅ Appropriate controls for each context
- ✅ Professional appearance

## 📱 **Responsive Considerations**

### **Mobile Optimization**

```javascript
// Smaller canvas for mobile
const isMobile = window.innerWidth < 768;

<Standard3DCanvas
  width={isMobile ? 280 : 400}
  height={isMobile ? 210 : 300}
  showControls={!isMobile}
  autoRotate={isMobile}
/>;
```

### **Container-based Sizing**

```javascript
// Responsive canvas that adapts to container
<Responsive3DCanvas
  fileUrl={model.url}
  fileName={model.name}
  maxWidth={600}
  aspectRatio={4 / 3}
/>
```

## 🎯 **Next Steps**

1. **Replace existing 3D viewers** with standardized canvases
2. **Update artwork cards** to use Card3DCanvas
3. **Implement in gallery views** with Gallery3DCanvas
4. **Add to upload flows** with Preview3DCanvas
5. **Test responsive behavior** across devices

## 🎉 **Result**

You now have a complete system of fixed-size 3D model viewers that provide consistent, professional 3D model display throughout your ArtVault application! 🎨✨
