import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import Footer from './components/Footer';
import './styles.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f7f9fa' }}>
          <h1 style={{ color: 'red' }}>Error Loading App</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main Layout Component
function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, isHydrated }) {
  const { isAuthenticated } = useAuthStore();
  console.log('ProtectedRoute - isHydrated:', isHydrated, 'isAuthenticated:', isAuthenticated);
  
  // Don't render until we know the auth state
  if (!isHydrated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#536471' }}>Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  const { hydrate, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = React.useState(false);
  console.log('App - Initial isAuthenticated:', isAuthenticated, 'isHydrated:', isHydrated);

  // Hydrate auth store on app load
  useEffect(() => {
    console.log('App - Running hydrate');
    hydrate();
    setIsHydrated(true);
    console.log('App - Hydrate complete');
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <MainLayout>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isHydrated={isHydrated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute isHydrated={isHydrated}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute isHydrated={isHydrated}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute isHydrated={isHydrated}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isHydrated={isHydrated}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route - redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* 404 Not Found - redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  );
}
