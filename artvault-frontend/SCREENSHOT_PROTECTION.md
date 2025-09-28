# ArtVault Screenshot Protection

## Status: DISABLED

The screenshot protection feature is currently **disabled** to allow for normal development and testing.

## Protection Features Available

When enabled, the system provides:

- ✅ **Print Screen blocking** - Prevents PrtScn, Alt+PrtScn, Win+PrtScn
- ✅ **Developer tools blocking** - F12, Ctrl+Shift+I, Console detection
- ✅ **Right-click disabled** - Context menu blocked
- ✅ **Text selection disabled** - Copy protection (except inputs)
- ✅ **Drag & drop disabled** - Image/video protection
- ✅ **Focus-based blurring** - Content hides when window loses focus
- ✅ **Dynamic watermark** - Moving protection overlay
- ✅ **Screen recording detection** - Blocks capture APIs
- ✅ **Keyboard shortcuts blocked** - Save, Copy, View Source, etc.
- ✅ **Warning system** - User-friendly alerts

## How to Enable Protection

### 1. Enable in App.jsx

Uncomment the protection code in `src/App.jsx`:

```javascript
import ScreenshotProtection from "./utils/ScreenshotProtection.js";

// In the useEffect:
useEffect(() => {
  const protection = new ScreenshotProtection({
    enableWatermark: true,
    enableBlurOnFocus: true,
    enableKeyboardBlocking: true,
    enableRightClickBlock: true,
    enableDevToolsBlock: true,
    watermarkText: "ArtVault Protected",
  });

  return () => {
    protection.disable();
  };
}, []);
```

### 2. Enable HTML Protection

Uncomment the protection scripts in `index.html`:

```html
<!-- Uncomment the security headers and protection script -->
```

### 3. Enable CSS Protection

Uncomment the protection styles in `src/App.css`:

```css
/* Uncomment the screenshot protection styles */
```

### 4. Use Protected Content Component

For specific content protection:

```jsx
import ProtectedContent from "../components/ProtectedContent.jsx";

<ProtectedContent showWatermark={true} watermarkText="Protected Art">
  <img src="artwork.jpg" alt="Protected artwork" />
</ProtectedContent>;
```

### 5. Use Protection Hook

For custom protection logic:

```jsx
import useScreenshotProtection from "../hooks/useScreenshotProtection.js";

const { disable } = useScreenshotProtection(true, {
  blurOnFocusLoss: true,
  showWarnings: true,
  blockPrintScreen: true,
});
```

## Files Involved

- `src/utils/ScreenshotProtection.js` - Main protection engine
- `src/components/ProtectedContent.jsx` - Content wrapper component
- `src/hooks/useScreenshotProtection.js` - React hook for protection
- `src/App.jsx` - Main app integration
- `index.html` - HTML-level protection
- `src/App.css` - Protection styles

## Development vs Production

For development, you can selectively disable protection:

```javascript
if (process.env.NODE_ENV === "development") {
  protection.disable();
}
```

## Testing Protection

When enabled, try these actions to test:

- Press Print Screen key
- Right-click on content
- Try to select text
- Press F12 to open dev tools
- Switch to another window/tab
- Try Ctrl+S, Ctrl+C, etc.

All should be blocked with appropriate warnings.
