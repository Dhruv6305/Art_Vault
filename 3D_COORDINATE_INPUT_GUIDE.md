# 📍 3D Camera Coordinate Input - Complete Guide

## 🎯 Feature Overview

Added a professional coordinate input panel that allows precise camera positioning using X, Y, Z coordinates. This gives users full control over camera placement for detailed model examination.

## 🎮 How to Use

### 1. Open Coordinate Panel

- Click the **📍 Coords** button in the top-right controls
- Panel appears at bottom-left with current camera position

### 2. Input Coordinates

- **X-axis** (Red): Left/Right movement
- **Y-axis** (Teal): Up/Down movement
- **Z-axis** (Blue): Forward/Backward movement
- Enter decimal values (e.g., 5.5, -2.3, 10.0)

### 3. Apply Position

- **✓ Apply** - Move camera to specified coordinates
- **📍 Get** - Populate fields with current camera position
- **✕ Close** - Hide the coordinate panel
- **Enter key** - Quick apply from any input field

## 🔧 Technical Features

### Real-time Position Tracking

```javascript
// Updates every frame
setCurrentCameraPos({
  x: parseFloat(camera.position.x.toFixed(2)),
  y: parseFloat(camera.position.y.toFixed(2)),
  z: parseFloat(camera.position.z.toFixed(2)),
});
```

### Smart Camera Movement

- **Maintains focus** on model center when moving
- **Updates orbit controls** to match new position
- **Preserves target** for smooth interaction after positioning

### Coordinate System

- **Origin (0,0,0)** - Model center (after auto-centering)
- **Positive X** - Right side of model
- **Positive Y** - Above model
- **Positive Z** - In front of model (towards viewer)

## 🎨 UI Design

### Color-coded Axes

- **🔴 X-axis** - Red label for horizontal movement
- **🟢 Y-axis** - Teal label for vertical movement
- **🔵 Z-axis** - Blue label for depth movement

### Panel Features

- **Semi-transparent background** with blur effect
- **Current position display** at top
- **Responsive input fields** with step increment of 0.1
- **Action buttons** with clear icons and tooltips
- **Keyboard shortcuts** (Enter to apply)

## 📊 Position Information Display

### Info Overlay Enhancement

```
📁 Model Info
Size: 2.5 × 1.8 × 3.2
Volume: 14.4 units³
Distance: 8.3 units
Pos: (5.2, 3.1, 7.8)  ← New coordinate display
```

### Real-time Updates

- Position updates every animation frame
- Rounded to 2 decimal places for readability
- Synchronized between panel and info overlay

## 🎯 Use Cases

### 1. Precise Positioning

```
Example coordinates for different views:
- Front view: (0, 0, 10)
- Side view: (10, 0, 0)
- Top view: (0, 10, 0)
- Isometric: (5, 5, 5)
```

### 2. Detailed Inspection

- Position camera close to specific model parts
- Create consistent viewing angles for documentation
- Return to exact positions for comparison

### 3. Professional Photography

- Set up precise camera angles for screenshots
- Create standardized product views
- Document model features from specific angles

## 🔍 Advanced Features

### Coordinate Validation

- Accepts positive and negative values
- Handles decimal precision
- Prevents invalid input (NaN protection)

### Smart Defaults

- Panel opens with current camera position
- Maintains model focus when repositioning
- Preserves zoom and rotation limits

### Keyboard Integration

- **Enter key** in any input field applies coordinates
- **Tab navigation** between X, Y, Z fields
- **Number input** with step controls

## 🧪 Testing Examples

### Basic Positioning

1. Open coordinate panel (📍 Coords button)
2. Try these coordinates:
   - `(0, 0, 10)` - Front view
   - `(10, 0, 0)` - Right side view
   - `(0, 10, 0)` - Top-down view
   - `(-5, 5, 5)` - Angled view

### Precision Movement

1. Get current position (📍 Get button)
2. Modify one coordinate by small amount (±0.5)
3. Apply to see subtle position change
4. Use for fine-tuning camera placement

### Quick Workflows

1. **📍 Get** → Modify → **Enter** (quick apply)
2. **📍 Coords** → Input → **✓ Apply** → **✕ Close**
3. Use info overlay position for reference

## 🎮 Integration with Existing Controls

### Works With All Features

- ✅ **Orbit controls** - Drag to rotate from new position
- ✅ **Zoom controls** - Scroll to zoom in/out
- ✅ **Auto-rotate** - Rotates around model from new position
- ✅ **Reset camera** - Returns to optimal calculated position
- ✅ **Focus/Fit** - Works from any coordinate position

### Professional Workflow

1. **📍 Coords** - Set precise position
2. **🎯 Focus** - Ensure targeting model center
3. **🔍 Fit** - Adjust distance to frame model
4. **▶️ Rotate** - Enable auto-rotation for presentation

## 💡 Tips & Best Practices

### Effective Positioning

- Start with **📍 Get** to see current coordinates
- Make **small incremental changes** (±1-2 units)
- Use **model dimensions** from info overlay as reference
- **Maintain reasonable distance** from model center

### Coordinate Reference

- **Model size** helps determine good coordinate ranges
- **Distance value** shows how far you are from center
- **Negative coordinates** are valid and useful
- **Zero coordinates** place you at model center axis

### Workflow Optimization

- **Save favorite positions** by noting coordinates
- **Use consistent angles** for documentation
- **Combine with other controls** for best results
- **Test coordinates** before important screenshots

The coordinate input system provides professional-level camera control while maintaining the intuitive nature of the existing 3D viewer!
