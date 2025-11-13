// API Utilities for handling external API calls
export const handleApiError = (
  error,
  fallbackMessage = "Service temporarily unavailable"
) => {
  if (import.meta.env?.DEV) {
    console.error("API Error:", error);
  }

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Network error - please check your connection";
  }

  if (error.message.includes("CORS")) {
    return "Service access restricted - using fallback data";
  }

  return fallbackMessage;
};

export const withRetry = async (apiCall, maxRetries = 2, delay = 1000) => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const createAbortController = (timeoutMs = 10000) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  return {
    controller,
    cleanup: () => clearTimeout(timeoutId),
  };
};
