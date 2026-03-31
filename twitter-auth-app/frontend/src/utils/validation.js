/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Username validation
 */
export const isValidUsername = (username) => {
  if (!username) return false;
  if (username.length < 3) return false;
  if (username.length > 30) return false;
  return /^[a-zA-Z0-9]+$/.test(username);
};

/**
 * Password strength validation
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  const warnings = [];

  if (!password) {
    return { valid: false, errors: ['Password is required'], warnings };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  // Warnings
  if (password.length < 12) {
    warnings.push('Consider using a longer password for better security');
  }
  if (!/[^a-zA-Z0-9@$!%*?&\s]/.test(password)) {
    warnings.push('Consider using additional special characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    strength: calculatePasswordStrength(password),
  };
};

/**
 * Calculate password strength score (0-100)
 */
export const calculatePasswordStrength = (password) => {
  let score = 0;

  if (!password) return 0;

  // Length scoring
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[@$!%*?&]/.test(password)) score += 15;

  return Math.min(score, 100);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (score) => {
  if (score < 20) return { label: 'Very Weak', color: '#d32f2f' };
  if (score < 40) return { label: 'Weak', color: '#f57c00' };
  if (score < 60) return { label: 'Fair', color: '#fbc02d' };
  if (score < 80) return { label: 'Good', color: '#7cb342' };
  return { label: 'Strong', color: '#388e3c' };
};

/**
 * Validate all signup fields
 */
export const validateSignupForm = (data) => {
  const { email, username, password, confirmPassword } = data;
  const errors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!username) {
    errors.username = 'Username is required';
  } else if (!isValidUsername(username)) {
    errors.username = 'Username must be 3-30 alphanumeric characters';
  }

  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors[0];
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate all login fields
 */
export const validateLoginForm = (data) => {
  const { email, password } = data;
  const errors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
