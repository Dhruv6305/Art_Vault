import React from "react";
import {
  getPasswordStrength,
  validatePassword,
} from "../../utils/validation.js";

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const validation = validatePassword(password);

  return (
    <div className="password-strength-indicator">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${
              (Object.values(validation).filter(Boolean).length - 1) * 25
            }%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <div className="strength-requirements">
        <div className={`requirement ${validation.minLength ? "met" : ""}`}>
          {validation.minLength ? "✓" : "○"} At least 6 characters
        </div>
        <div className={`requirement ${validation.hasUpperCase ? "met" : ""}`}>
          {validation.hasUpperCase ? "✓" : "○"} Uppercase letter
        </div>
        <div className={`requirement ${validation.hasLowerCase ? "met" : ""}`}>
          {validation.hasLowerCase ? "✓" : "○"} Lowercase letter
        </div>
        <div className={`requirement ${validation.hasNumbers ? "met" : ""}`}>
          {validation.hasNumbers ? "✓" : "○"} Number
        </div>
      </div>
      <div className="strength-label" style={{ color: strength.color }}>
        Password strength: {strength.level}
      </div>
    </div>
  );
};

export default PasswordStrength;
