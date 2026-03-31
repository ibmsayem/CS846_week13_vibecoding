import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#536471' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #e8d5f2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(29, 155, 240, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite reverse',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(30px) translateX(20px); }
        }
      `}</style>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #eff3f4',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1
            onClick={() => navigate('/home')}
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#0f1419',
              cursor: 'pointer',
              margin: 0,
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f7f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            𝕏CS846
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/home')}
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-primary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Settings Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eff3f4',
            backgroundColor: '#f7f9fa'
          }}>
            <button
              onClick={() => setActiveTab('account')}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === 'account' ? 'white' : 'transparent',
                borderBottom: activeTab === 'account' ? '3px solid #1da1f2' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'account' ? 'bold' : 'normal',
                color: '#0f1419',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
            >
              Account Settings
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === 'privacy' ? 'white' : 'transparent',
                borderBottom: activeTab === 'privacy' ? '3px solid #1da1f2' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'privacy' ? 'bold' : 'normal',
                color: '#0f1419',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
            >
              Privacy & Safety
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                backgroundColor: activeTab === 'notifications' ? 'white' : 'transparent',
                borderBottom: activeTab === 'notifications' ? '3px solid #1da1f2' : 'none',
                cursor: 'pointer',
                fontWeight: activeTab === 'notifications' ? 'bold' : 'normal',
                color: '#0f1419',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
            >
              Notifications
            </button>
          </div>

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#0f1419' }}>
                Account Settings
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#536471', marginBottom: '8px' }}>
                  Email
                </label>
                <p style={{ fontSize: '15px', color: '#0f1419', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', margin: 0 }}>
                  {user.email}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#536471', marginBottom: '8px' }}>
                  Username
                </label>
                <p style={{ fontSize: '15px', color: '#0f1419', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', margin: 0 }}>
                  @{user.username}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#536471', marginBottom: '8px' }}>
                  Name
                </label>
                <p style={{ fontSize: '15px', color: '#0f1419', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', margin: 0 }}>
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#536471', marginBottom: '8px' }}>
                  Account Status
                </label>
                <p style={{ fontSize: '15px', color: '#0f1419', padding: '12px', backgroundColor: '#f7f9fa', borderRadius: '8px', margin: 0 }}>
                  ✓ Verified
                </p>
              </div>
            </div>
          )}

          {/* Privacy & Safety Tab */}
          {activeTab === 'privacy' && (
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#0f1419' }}>
                Privacy & Safety
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '500', color: '#0f1419' }}>
                    Private Account
                  </label>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '13px', color: '#536471', margin: 0 }}>
                  Make your profile and posts private (coming soon)
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '500', color: '#0f1419' }}>
                    Allow Messages
                  </label>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '13px', color: '#536471', margin: 0 }}>
                  Allow anyone to send you direct messages (coming soon)
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#0f1419' }}>
                Notification Preferences
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '500', color: '#0f1419' }}>
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '13px', color: '#536471', margin: 0 }}>
                  Receive email updates about your activities (coming soon)
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '500', color: '#0f1419' }}>
                    Like Notifications
                  </label>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '13px', color: '#536471', margin: 0 }}>
                  Get notified when someone likes your post (coming soon)
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '15px', fontWeight: '500', color: '#0f1419' }}>
                    Reply Notifications
                  </label>
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    disabled
                  />
                </div>
                <p style={{ fontSize: '13px', color: '#536471', margin: 0 }}>
                  Get notified when someone replies to your post (coming soon)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px',
          marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#d32f2f' }}>
            Danger Zone
          </h3>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b71c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d32f2f'}
          >
            Logout
          </button>
          <p style={{ fontSize: '13px', color: '#536471', marginTop: '12px', margin: '12px 0 0 0' }}>
            Click the button above to logout from all devices
          </p>
        </div>
      </div>
    </div>
  );
}
