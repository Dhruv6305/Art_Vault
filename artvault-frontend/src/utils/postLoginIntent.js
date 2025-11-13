/**
 * Post-Login Intent Management Utilities
 * 
 * These utilities manage the storage and retrieval of user intent when they are
 * redirected to login during an action (e.g., clicking "Buy Now" while unauthenticated).
 * The intent is persisted in localStorage to survive OAuth redirects and page refreshes.
 */

const STORAGE_KEY = 'postLoginIntent';

/**
 * Save post-login intent to localStorage
 * 
 * Stores the user's intended action and destination after authentication.
 * This data persists across page refreshes and OAuth redirects.
 * 
 * @param {Object} intent - The intent object to save
 * @param {string} intent.action - The action type to resume (e.g., 'buy')
 * @param {string} intent.returnTo - The path to return to after login (e.g., '/artwork/123')
 * @returns {boolean} - True if save was successful, false otherwise
 * 
 * @example
 * savePostLoginIntent({
 *   action: 'buy',
 *   returnTo: '/artwork/123'
 * });
 */
export const savePostLoginIntent = (intent) => {
  try {
    // Validate intent structure
    if (!intent || typeof intent !== 'object') {
      console.error('Invalid intent: must be an object');
      return false;
    }

    if (!intent.action || typeof intent.action !== 'string') {
      console.error('Invalid intent: action must be a non-empty string');
      return false;
    }

    if (!intent.returnTo || typeof intent.returnTo !== 'string') {
      console.error('Invalid intent: returnTo must be a non-empty string');
      return false;
    }

    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available. Intent will only be preserved via navigation state.');
      return false;
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
    return true;
  } catch (error) {
    // Handle localStorage unavailability (e.g., private browsing, storage quota exceeded)
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Unable to save post-login intent.');
    } else if (error.name === 'SecurityError') {
      console.error('localStorage access denied (possibly private browsing mode). Intent will only be preserved via navigation state.');
    } else {
      console.error('Failed to save post-login intent:', error);
    }
    return false;
  }
};

/**
 * Retrieve and clear post-login intent from localStorage
 * 
 * Reads the stored intent, validates its structure, and immediately removes it
 * from storage to prevent reuse. This ensures the intent is only acted upon once.
 * 
 * @returns {Object|null} - The intent object if valid, null otherwise
 * @returns {string} return.action - The action type to resume
 * @returns {string} return.returnTo - The path to return to
 * 
 * @example
 * const intent = getAndClearPostLoginIntent();
 * if (intent?.action === 'buy') {
 *   navigate(intent.returnTo, { state: { triggerBuyNow: true } });
 * }
 */
export const getAndClearPostLoginIntent = () => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available. Falling back to navigation state only.');
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    
    // No intent stored
    if (!raw) {
      return null;
    }

    // Parse the stored intent
    const intent = JSON.parse(raw);
    
    // Always clear the intent after reading, even if invalid
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (removeError) {
      console.error('Failed to clear post-login intent from storage:', removeError);
    }

    // Validate intent structure
    if (!intent || typeof intent !== 'object') {
      console.warn('Invalid intent structure: not an object');
      return null;
    }

    if (!intent.action || typeof intent.action !== 'string') {
      console.warn('Invalid intent structure: missing or invalid action');
      return null;
    }

    if (!intent.returnTo || typeof intent.returnTo !== 'string') {
      console.warn('Invalid intent structure: missing or invalid returnTo');
      return null;
    }

    return intent;
  } catch (error) {
    // Handle localStorage unavailability or JSON parsing errors
    if (error.name === 'SecurityError') {
      console.error('localStorage access denied. Falling back to navigation state only.');
    } else if (error instanceof SyntaxError) {
      console.error('Failed to parse post-login intent (corrupted data):', error);
    } else {
      console.error('Failed to retrieve post-login intent:', error);
    }
    
    // Clean up potentially corrupted data
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (cleanupError) {
      console.error('Failed to clean up corrupted intent data:', cleanupError);
    }
    
    return null;
  }
};

/**
 * Check if there's a pending post-login intent
 * 
 * Checks for the existence of stored intent without retrieving or clearing it.
 * Useful for conditional logic before committing to reading the intent.
 * 
 * @returns {boolean} - True if intent exists, false otherwise
 * 
 * @example
 * if (hasPostLoginIntent()) {
 *   console.log('User has a pending action after login');
 * }
 */
export const hasPostLoginIntent = () => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      return false;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    return !!raw;
  } catch (error) {
    // Handle localStorage unavailability
    if (error.name === 'SecurityError') {
      console.warn('localStorage access denied. Cannot check for post-login intent.');
    } else {
      console.error('Failed to check for post-login intent:', error);
    }
    return false;
  }
};
