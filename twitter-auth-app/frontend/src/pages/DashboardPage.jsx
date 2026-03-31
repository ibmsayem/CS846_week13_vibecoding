import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles.css';
import axios from 'axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, logoutAllDevices, isLoading } = useAuthStore();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleLogoutAll = async () => {
    try {
      if (window.confirm('This will log you out from all devices. Continue?')) {
        await logoutAllDevices();
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout all failed:', err);
      alert('Failed to logout from all devices');
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/v1/posts/feed');
        setPosts(response.data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '24px', color: '#0f1419' }}>Dashboard</h1>
          <button
            onClick={handleLogout}
            className="btn btn-primary"
            style={{ width: 'auto', padding: '8px 16px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* User Profile Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#0f1419' }}>Your Profile</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>EMAIL</p>
              <p style={{ color: '#0f1419', fontWeight: '500' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>USERNAME</p>
              <p style={{ color: '#0f1419', fontWeight: '500' }}>@{user.username}</p>
            </div>
            {user.firstName && (
              <div>
                <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>FIRST NAME</p>
                <p style={{ color: '#0f1419', fontWeight: '500' }}>{user.firstName}</p>
              </div>
            )}
            {user.lastName && (
              <div>
                <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>LAST NAME</p>
                <p style={{ color: '#0f1419', fontWeight: '500' }}>{user.lastName}</p>
              </div>
            )}
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>ACCOUNT STATUS</p>
              <p style={{ color: user.isVerified ? '#17bf63' : '#f57f17', fontWeight: '500' }}>
                {user.isVerified ? '✓ Verified' : '✓ Verified'}
              </p>
            </div>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px' }}>JOINED</p>
              <p style={{ color: '#0f1419', fontWeight: '500' }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#0f1419' }}>Security Settings</h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid #eff3f4'
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f1419', marginBottom: '4px' }}>
                Two-Factor Authentication
              </p>
              <p style={{ fontSize: '12px', color: '#536471' }}>
                Protect your account with 2FA
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} disabled>
              Configure
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px'
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f1419', marginBottom: '4px' }}>
                Change Password
              </p>
              <p style={{ fontSize: '12px', color: '#536471' }}>
                Update your account password
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} disabled>
              Change
            </button>
          </div>
        </div>

        {/* Logout All Devices */}
        <div style={{
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#d32f2f' }}>Logout All Devices</h2>
          <p style={{ fontSize: '14px', color: '#c62828', marginBottom: '16px' }}>
            Sign out from all devices. You'll need to log in again on each device.
          </p>
          <button
            onClick={handleLogoutAll}
            className="btn btn-primary"
            style={{ 
              width: 'auto', 
              padding: '8px 16px',
              backgroundColor: '#d32f2f'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Logout All Devices'}
          </button>
        </div>

        {/* Posts */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#0f1419' }}>Recent Posts</h2>
          {posts.map((post) => (
            <div key={post.id}>
              <p>{post.content}</p>
              <small>Posted by User {post.userId} on {new Date(post.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#536471', fontSize: '12px' }}>
          <p>Session expires in 15 minutes of inactivity</p>
        </div>
      </div>
    </div>
  );
}
