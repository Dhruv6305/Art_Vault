// Utility functions for formatting data

export const formatPrice = (price) => {
  if (!price || typeof price !== "object") return "Price not available";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price.amount || 0);
};

export const formatDimensions = (dimensions) => {
  if (!dimensions) return "";

  // If it's already a string, return it
  if (typeof dimensions === "string") return dimensions;

  // If it's an object, format it
  if (typeof dimensions === "object") {
    const { width, height, depth, unit } = dimensions;

    // Handle missing or zero values
    const w = width || 0;
    const h = height || 0;
    const d = depth || 0;
    const u = unit || "cm";

    if (d && d !== "0" && d !== 0) {
      return `${w} × ${h} × ${d} ${u}`;
    } else {
      return `${w} × ${h} ${u}`;
    }
  }

  return String(dimensions);
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
