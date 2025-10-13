// Performance optimization utilities

// Debounce function for search inputs and filters
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image preloader for better UX
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Memory usage checker (development only)
export const checkMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && performance.memory) {
    const memory = performance.memory;
    const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    
    console.log(`Memory: ${used}MB / ${total}MB (limit: ${limit}MB)`);
    
    if (used > limit * 0.8) {
      console.warn('⚠️ High memory usage detected!');
    }
  }
};

// Optimize images for different screen sizes
export const getOptimizedImageUrl = (originalUrl, width = 300, quality = 80) => {
  // This would typically integrate with an image optimization service
  // For now, return the original URL
  return originalUrl;
};

// Virtual scrolling helper for large lists
export const calculateVisibleItems = (scrollTop, itemHeight, containerHeight, totalItems) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  );
  
  return { startIndex, endIndex };
};

// Cleanup function for event listeners and timers
export const createCleanupManager = () => {
  const cleanupFunctions = [];
  
  return {
    add: (cleanupFn) => cleanupFunctions.push(cleanupFn),
    cleanup: () => {
      cleanupFunctions.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      });
      cleanupFunctions.length = 0;
    }
  };
};

// Performance timing decorator
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        
        if (duration > 100) {
          console.warn(`🐌 Slow operation: ${name} took ${duration.toFixed(2)}ms`);
        }
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};