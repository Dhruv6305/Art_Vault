import { useEffect, useRef } from 'react';

/**
 * Custom hook for screenshot protection
 * @param {boolean} enabled - Whether protection is enabled
 * @param {Object} options - Protection options
 */
const useScreenshotProtection = (enabled = true, options = {}) => {
  const protectionRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Add protection class to body
    document.body.classList.add('screenshot-protection-active');

    const defaultOptions = {
      blurOnFocusLoss: true,
      showWarnings: true,
      blockPrintScreen: true,
      blockRightClick: true,
      blockDevTools: true,
      ...options
    };

    // Block Print Screen and other screenshot keys
    const handleKeyDown = (e) => {
      if (!defaultOptions.blockPrintScreen) return;

      const blockedKeys = ['PrintScreen', 'F12'];
      const blockedCombos = [
        { ctrl: true, shift: true, key: 'i' }, // Dev Tools
        { ctrl: true, shift: true, key: 'j' }, // Console
        { ctrl: true, shift: true, key: 's' }, // Firefox Screenshot
        { ctrl: true, key: 'u' }, // View Source
        { ctrl: true, key: 's' }, // Save
      ];

      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        if (defaultOptions.showWarnings) {
          console.warn('🚫 Screenshot attempt blocked');
        }
        return false;
      }

      for (const combo of blockedCombos) {
        const match = Object.keys(combo).every(key => {
          if (key === 'key') return e.key.toLowerCase() === combo[key].toLowerCase();
          return e[key] === combo[key];
        });

        if (match) {
          e.preventDefault();
          if (defaultOptions.showWarnings) {
            console.warn('🚫 Blocked action:', combo);
          }
          return false;
        }
      }
    };

    // Blur content when window loses focus
    const handleVisibilityChange = () => {
      if (!defaultOptions.blurOnFocusLoss) return;

      if (document.hidden) {
        document.body.style.filter = 'blur(8px)';
        document.body.style.transition = 'filter 0.2s ease';
      } else {
        setTimeout(() => {
          document.body.style.filter = 'none';
        }, 200);
      }
    };

    const handleWindowBlur = () => {
      if (!defaultOptions.blurOnFocusLoss) return;
      document.body.style.filter = 'blur(8px)';
    };

    const handleWindowFocus = () => {
      if (!defaultOptions.blurOnFocusLoss) return;
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 200);
    };

    // Block right-click
    const handleContextMenu = (e) => {
      if (!defaultOptions.blockRightClick) return;
      e.preventDefault();
      if (defaultOptions.showWarnings) {
        console.warn('🚫 Right-click blocked');
      }
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    if (defaultOptions.blockRightClick) {
      document.addEventListener('contextmenu', handleContextMenu, true);
    }

    // Store cleanup function
    protectionRef.current = () => {
      document.body.classList.remove('screenshot-protection-active');
      document.body.style.filter = 'none';
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };

    // Cleanup on unmount
    return protectionRef.current;
  }, [enabled, options]);

  // Return cleanup function for manual control
  return {
    disable: () => {
      if (protectionRef.current) {
        protectionRef.current();
        protectionRef.current = null;
      }
    }
  };
};

export default useScreenshotProtection;