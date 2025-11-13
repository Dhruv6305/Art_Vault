// Utility functions for formatting data

// List of currencies that don't use decimal places
const ZERO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'VND', 'CLP', 'BIF', 'DJF', 'GNF', 'ISK', 'KMF', 'PYG', 'RWF', 'UGX', 'VUV', 'XAF', 'XOF', 'XPF'];

/**
 * Format currency amount with proper symbol and decimal places
 * @param {number|Object} price - Price as number or object with amount and currency
 * @param {string} currency - Currency code (optional if price is object)
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (price, currency = 'USD', locale = 'en-US') => {
  let amount;
  let currencyCode;

  // Handle object format (backward compatibility)
  if (typeof price === 'object' && price !== null) {
    amount = price.amount || 0;
    currencyCode = price.currency || currency;
  } else {
    amount = price || 0;
    currencyCode = currency;
  }

  // Normalize currency code
  currencyCode = currencyCode.toUpperCase();

  // Determine decimal places based on currency
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currencyCode);
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  });

  return formatter.format(amount);
};

/**
 * Legacy formatPrice function for backward compatibility
 * @deprecated Use formatCurrency instead
 */
export const formatPrice = (price) => {
  if (!price || typeof price !== "object") return "Price not available";

  return formatCurrency(price.amount || 0, price.currency || "USD");
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

/**
 * Get currency symbol for a given currency code
 * @param {string} currency - ISO currency code
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = 'USD', locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Format 0 and extract the symbol
  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find(part => part.type === 'currency');
  
  return symbolPart ? symbolPart.value : currency;
};

/**
 * Check if a currency uses zero decimal places
 * @param {string} currency - ISO currency code
 * @returns {boolean} True if currency doesn't use decimals
 */
export const isZeroDecimalCurrency = (currency) => {
  return ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase());
};

/**
 * Format amount for display with currency-specific decimal handling
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount without currency symbol
 */
export const formatAmount = (amount, currency = 'USD') => {
  const currencyCode = currency.toUpperCase();
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currencyCode);
  
  if (isZeroDecimal) {
    return Math.round(amount).toLocaleString('en-US');
  }
  
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
