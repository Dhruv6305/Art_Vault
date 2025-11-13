// File utility functions for saving and downloading

export const downloadAsJSON = (data, filename = "data.json") => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsText = (text, filename = "data.txt") => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("Failed to save to localStorage:", error);
    }
    return false;
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("Failed to load from localStorage:", error);
    }
    return null;
  }
};

export const exportSystemState = () => {
  const state = {
    timestamp: new Date().toISOString(),
    localStorage: { ...localStorage },
    userAgent: navigator.userAgent,
    url: window.location.href,
    token: localStorage.getItem("token") ? "Present" : "Missing",
  };

  downloadAsJSON(state, `artvault-state-${Date.now()}.json`);
};
