/**
 * ArtVault Screenshot Protection System
 * Comprehensive protection against unauthorized content capture
 */

class ScreenshotProtection {
  constructor(options = {}) {
    this.options = {
      enableWatermark: true,
      enableBlurOnFocus: true,
      enableKeyboardBlocking: true,
      enableRightClickBlock: true,
      enableDevToolsBlock: true,
      watermarkText: 'ArtVault Protected',
      ...options
    };
    
    this.isActive = false;
    this.watermarkElement = null;
    this.warningElement = null;
    
    this.init();
  }

  init() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🛡️ ArtVault Screenshot Protection Activated');
    
    // Apply all protection methods
    this.blockScreenshotKeys();
    this.blockRightClick();
    this.blockTextSelection();
    this.blockDeveloperTools();
    this.addFocusProtection();
    
    if (this.options.enableWatermark) {
      this.addWatermark();
    }
    
    // Add protection CSS
    this.addProtectionStyles();
  }

  // Block screenshot keyboard shortcuts
  blockScreenshotKeys() {
    const blockedKeys = [
      'PrintScreen',
      'F12'
    ];
    
    const blockedCombinations = [
      { ctrl: true, key: 's' }, // Save
      { ctrl: true, key: 'a' }, // Select All
      { ctrl: true, key: 'c' }, // Copy
      { ctrl: true, key: 'v' }, // Paste
      { ctrl: true, key: 'x' }, // Cut
      { ctrl: true, key: 'u' }, // View Source
      { ctrl: true, shift: true, key: 'i' }, // Dev Tools
      { ctrl: true, shift: true, key: 'j' }, // Console
      { ctrl: true, shift: true, key: 'c' }, // Inspect
      { ctrl: true, shift: true, key: 's' }, // Firefox Screenshot
      { alt: true, key: 'PrintScreen' }, // Alt + Print Screen
      { meta: true, key: 'PrintScreen' }, // Win + Print Screen
    ];

    document.addEventListener('keydown', (e) => {
      // Block individual keys
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        this.showWarning('Screenshots are not allowed');
        return false;
      }

      // Block key combinations
      for (const combo of blockedCombinations) {
        const ctrlMatch = combo.ctrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = combo.alt ? e.altKey : !e.altKey;
        const metaMatch = combo.meta ? e.metaKey : !e.metaKey;
        const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && metaMatch && keyMatch) {
          e.preventDefault();
          e.stopPropagation();
          this.showWarning('This action is not allowed');
          return false;
        }
      }
    }, true);
  }

  // Block right-click context menu
  blockRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showWarning('Right-click is disabled');
      return false;
    }, true);

    // Block drag and drop
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    }, true);
  }

  // Block text selection
  blockTextSelection() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('selectstart', (e) => {
      if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName) && 
          !e.target.contentEditable) {
        e.preventDefault();
        return false;
      }
    }, true);
  }

  // Block developer tools
  blockDeveloperTools() {
    // Detect dev tools by window size changes
    let devtools = { open: false };
    const threshold = 160;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.blockPage('Developer tools detected');
        }
      } else {
        devtools.open = false;
      }
    };

    setInterval(detectDevTools, 500);

    // Console detection trick
    let element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        this.blockPage('Console access detected');
      }
    });

    setInterval(() => {
      console.log(element);
      console.clear();
    }, 1000);
  }

  // Add focus-based protection
  addFocusProtection() {
    if (!this.options.enableBlurOnFocus) return;

    const blurContent = () => {
      document.body.style.filter = 'blur(10px)';
      document.body.style.transition = 'filter 0.2s ease';
    };

    const unblurContent = () => {
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 200);
    };

    // Blur when window loses focus
    window.addEventListener('blur', blurContent);
    window.addEventListener('focus', unblurContent);

    // Blur when page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        blurContent();
      } else {
        unblurContent();
      }
    });
  }

  // Add watermark overlay
  addWatermark() {
    this.watermarkElement = document.createElement('div');
    this.watermarkElement.id = 'artvault-watermark';
    this.watermarkElement.textContent = this.options.watermarkText;
    
    Object.assign(this.watermarkElement.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'rgba(255, 255, 255, 0.08)',
      pointerEvents: 'none',
      zIndex: '999999',
      userSelect: 'none',
      fontFamily: 'Arial, sans-serif',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap'
    });

    document.body.appendChild(this.watermarkElement);

    // Animate watermark position slightly
    setInterval(() => {
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;
      this.watermarkElement.style.transform = 
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(-45deg)`;
    }, 5000);
  }

  // Add protection styles
  addProtectionStyles() {
    const style = document.createElement('style');
    style.id = 'artvault-protection-styles';
    style.textContent = `
      /* Hide scrollbars to prevent screenshot context clues */
      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
      
      /* Prevent image context menu and dragging */
      img, video {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Make videos undownloadable */
      video {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Show warning message
  showWarning(message) {
    // Remove existing warning
    if (this.warningElement) {
      this.warningElement.remove();
    }

    this.warningElement = document.createElement('div');
    this.warningElement.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff4444, #cc0000);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(255, 68, 68, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        animation: slideInWarning 0.3s ease-out;
      ">
        🚫 ${message}
      </div>
      <style>
        @keyframes slideInWarning {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
      </style>
    `;

    document.body.appendChild(this.warningElement);

    // Auto-remove warning after 3 seconds
    setTimeout(() => {
      if (this.warningElement) {
        this.warningElement.style.animation = 'slideInWarning 0.3s ease-out reverse';
        setTimeout(() => {
          if (this.warningElement) {
            this.warningElement.remove();
            this.warningElement = null;
          }
        }, 300);
      }
    }, 3000);
  }

  // Block entire page
  blockPage(reason) {
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 99999999;
      ">
        <div style="text-align: center; max-width: 500px; padding: 40px;">
          <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
          <h1 style="font-size: 32px; margin-bottom: 16px; color: #f1f5f9;">Access Restricted</h1>
          <p style="font-size: 18px; margin-bottom: 24px; color: #94a3b8;">${reason}</p>
          <p style="font-size: 14px; color: #64748b;">
            This content is protected by ArtVault's security system.<br>
            Please close developer tools and refresh the page to continue.
          </p>
          <button onclick="window.location.reload()" style="
            margin-top: 24px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.2s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }

  // Disable protection (for development)
  disable() {
    this.isActive = false;
    
    // Remove watermark
    if (this.watermarkElement) {
      this.watermarkElement.remove();
      this.watermarkElement = null;
    }
    
    // Remove warning
    if (this.warningElement) {
      this.warningElement.remove();
      this.warningElement = null;
    }
    
    // Remove styles
    const protectionStyles = document.getElementById('artvault-protection-styles');
    if (protectionStyles) {
      protectionStyles.remove();
    }
    
    // Reset body styles
    document.body.style.filter = 'none';
    
    console.log('🛡️ Screenshot Protection Disabled');
  }

  // Re-enable protection
  enable() {
    if (!this.isActive) {
      this.init();
    }
  }
}

export default ScreenshotProtection;