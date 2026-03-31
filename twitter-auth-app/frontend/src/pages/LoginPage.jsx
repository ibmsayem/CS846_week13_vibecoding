import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateLoginForm } from '../utils/validation';
import '../styles.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisteredAccounts, setShowRegisteredAccounts] = useState(false);
  const [registeredAccounts, setRegisteredAccounts] = useState([]);

  // Fetch registered accounts from development endpoint
  useEffect(() => {
    const fetchRegisteredAccounts = async () => {
      try {
        const response = await fetch('/api/v1/auth/dev/credentials');
        if (response.ok) {
          const data = await response.json();
          setRegisteredAccounts(data.data || []);
        }
      } catch (error) {
        console.log('Dev endpoint not available (production mode)');
      }
    };

    if (showRegisteredAccounts) {
      fetchRegisteredAccounts();
    }
  }, [showRegisteredAccounts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validate form
    const { isValid, errors: validationErrors } = validateLoginForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      setErrors({
        submit: err.message || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Log in to your Twitter-like account</p>
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

          {/* Password Field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="link" style={{ fontSize: '12px' }}>
                Forgot?
              </Link>
            </div>
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
                  fontSize: '14px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <div id="password-error" className="error-message">
                {errors.password}
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
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="form-footer">
          Don't have an account?
          <Link to="/signup">Sign up</Link>
        </div>

        {/* Security Note */}
        <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', fontSize: '12px', color: '#536471' }}>
          🔒 Your password is secure. We'll never share it with anyone.
        </div>

        {/* Development - Registered Accounts (only in development mode) */}
        {registeredAccounts.length > 0 && (
          <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '8px', borderLeft: '4px solid #1da1f2' }}>
            <button
              type="button"
              onClick={() => setShowRegisteredAccounts(!showRegisteredAccounts)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1da1f2',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                padding: 0
              }}
            >
              {showRegisteredAccounts ? '▼' : '▶'} 🧪 Registered Test Accounts ({registeredAccounts.length})
            </button>
            
            {showRegisteredAccounts && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#0f1419' }}>
                {registeredAccounts.map((account, index) => (
                  <div key={index} style={{ padding: '8px', margin: '4px 0', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e1e8ed' }}>
                    <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                      {account.firstName} {account.lastName}
                    </p>
                    <p style={{ margin: '2px 0', color: '#536471' }}>
                      📧 {account.email}
                    </p>
                    <p style={{ margin: '2px 0', color: '#536471', fontSize: '11px' }}>
                      Created: {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
