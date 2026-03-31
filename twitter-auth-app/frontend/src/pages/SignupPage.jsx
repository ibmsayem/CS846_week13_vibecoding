import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateSignupForm, getPasswordStrengthLabel, calculatePasswordStrength } from '../utils/validation';
import '../styles.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate form
    const { isValid, errors: validationErrors } = validateSignupForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(
        formData.email,
        formData.username,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      navigate('/home');
    } catch (err) {
      setErrors({
        submit: err.message || 'Signup failed. Please try again.',
      });
    }
  };

  const strengthLabel = getPasswordStrengthLabel(passwordStrength);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the Twitter-like community today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-error">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-describedby="email-error"
            />
            {errors.email && (
              <div id="email-error" className="error-message">
                {errors.email}
              </div>
            )}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="username123"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-describedby="username-error"
            />
            {errors.username && (
              <div id="username-error" className="error-message">
                {errors.username}
              </div>
            )}
          </div>

          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name (Optional)
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                className="form-input"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name (Optional)
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                className="form-input"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#536471',
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="error-message">
                {errors.password}
              </div>
            )}

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: strengthLabel.color,
                    }}
                  ></div>
                </div>
                <div className="strength-label">
                  Strength: <span style={{ color: strengthLabel.color }}>{strengthLabel.label}</span>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#536471' }}>
              <p>Password must contain:</p>
              <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                <li style={{ color: formData.password.length >= 8 ? '#17bf63' : '#536471' }}>
                  {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                </li>
                <li style={{ color: /[A-Z]/.test(formData.password) ? '#17bf63' : '#536471' }}>
                  {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                </li>
                <li style={{ color: /[a-z]/.test(formData.password) ? '#17bf63' : '#536471' }}>
                  {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
                </li>
                <li style={{ color: /\d/.test(formData.password) ? '#17bf63' : '#536471' }}>
                  {/\d/.test(formData.password) ? '✓' : '○'} One number
                </li>
                <li style={{ color: /[@$!%*?&]/.test(formData.password) ? '#17bf63' : '#536471' }}>
                  {/[@$!%*?&]/.test(formData.password) ? '✓' : '○'} One special character (@$!%*?&)
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                aria-describedby="confirmPassword-error"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#536471',
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <div id="confirmPassword-error" className="error-message">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ marginTop: '24px' }}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="form-footer">
          Already have an account?
          <Link to="/login">Log in</Link>
        </div>

        {/* Terms/Privacy Note */}
        <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', fontSize: '11px', color: '#536471', lineHeight: '1.6' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy. We'll never share your data without your consent.
        </div>
      </div>
    </div>
  );
}
