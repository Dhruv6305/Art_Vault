export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
  };
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 13 && numAge <= 120;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  let strength = 0;

  if (validation.minLength) strength++;
  if (validation.hasUpperCase) strength++;
  if (validation.hasLowerCase) strength++;
  if (validation.hasNumbers) strength++;

  if (strength <= 1) return { level: "weak", color: "#ef4444" };
  if (strength <= 2) return { level: "fair", color: "#f59e0b" };
  if (strength <= 3) return { level: "good", color: "#10b981" };
  return { level: "strong", color: "#059669" };
};
