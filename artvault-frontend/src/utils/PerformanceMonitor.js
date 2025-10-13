// Simple performance monitoring utility
class PerformanceMonitor {
  static measureRender(componentName, renderFunction) {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      const result = renderFunction();
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame (60fps = 16.67ms per frame)
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      return result;
    }
    return renderFunction();
  }

  static logMemoryUsage() {
    if (process.env.NODE_ENV === 'development' && performance.memory) {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    }
  }

  static measureAsyncOperation(operationName, asyncFunction) {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      return asyncFunction().finally(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`⏱️ ${operationName} took ${duration.toFixed(2)}ms`);
      });
    }
    return asyncFunction();
  }
}

export default PerformanceMonitor;