import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/authService';
import '../styles.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserPosts();
    }
  }, [user, navigate]);

  const fetchUserPosts = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingPosts(true);
      const response = await api.get(`/posts/user/${user.id}`);
      setUserPosts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setUserPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setUserPosts(userPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    }
  };

  const handleEditPost = (postId, content) => {
    setEditingPostId(postId);
    setEditPostContent(content);
  };

  const handleSavePostEdit = async (postId) => {
    if (!editPostContent.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    try {
      await api.put(`/posts/${postId}`, { content: editPostContent });
      setEditingPostId(null);
      setEditPostContent('');
      setUserPosts(userPosts.map(post => 
        post.id === postId ? { ...post, content: editPostContent } : post
      ));
    } catch (err) {
      console.error('Failed to edit post:', err);
      alert('Failed to edit post');
    }
  };

  const handleCancelPostEdit = () => {
    setEditingPostId(null);
    setEditPostContent('');
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
              onClick={() => navigate('/settings')}
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Settings
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
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {/* Cover Image */}
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#1da1f2',
              border: '4px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile Content */}
          <div style={{ padding: '60px 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f1419', marginBottom: '4px' }}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </h2>
                <p style={{ fontSize: '15px', color: '#536471' }}>@{user.username}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary"
                style={{ width: 'auto', padding: '8px 24px' }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Bio */}
            {!isEditing ? (
              <p style={{
                fontSize: '15px',
                color: '#0f1419',
                marginBottom: '20px',
                lineHeight: '1.5',
                minHeight: '40px'
              }}>
                {bio || 'Add a bio to tell us about yourself'}
              </p>
            ) : (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Add a bio to tell us about yourself"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '12px',
                  border: '1px solid #eff3f4',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
            )}

            {/* Profile Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              padding: '16px 0',
              borderTop: '1px solid #eff3f4',
              borderBottom: '1px solid #eff3f4'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419' }}>0</p>
                <p style={{ fontSize: '13px', color: '#536471' }}>Followers</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419' }}>0</p>
                <p style={{ fontSize: '13px', color: '#536471' }}>Following</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419' }}>{userPosts.length}</p>
                <p style={{ fontSize: '13px', color: '#536471' }}>Posts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419', marginBottom: '20px' }}>
            Account Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>EMAIL</p>
              <p style={{ color: '#0f1419', fontSize: '15px' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>USERNAME</p>
              <p style={{ color: '#0f1419', fontSize: '15px' }}>@{user.username}</p>
            </div>
            {user.firstName && (
              <div>
                <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>FIRST NAME</p>
                <p style={{ color: '#0f1419', fontSize: '15px' }}>{user.firstName}</p>
              </div>
            )}
            {user.lastName && (
              <div>
                <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>LAST NAME</p>
                <p style={{ color: '#0f1419', fontSize: '15px' }}>{user.lastName}</p>
              </div>
            )}
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>JOINED</p>
              <p style={{ color: '#0f1419', fontSize: '15px' }}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p style={{ color: '#536471', fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>STATUS</p>
              <p style={{ color: user.isVerified ? '#17bf63' : '#f57f17', fontSize: '15px', fontWeight: '500' }}>
                {user.isVerified ? '✓ Verified' : '✓ Verified'}
              </p>
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSaveProfile}
              className="btn btn-primary"
              style={{ marginTop: '24px', width: '100%' }}
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Security Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419', marginBottom: '20px' }}>
            Security Settings
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid #eff3f4'
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f1419' }}>
                Two-Factor Authentication
              </p>
              <p style={{ fontSize: '12px', color: '#536471', marginTop: '4px' }}>
                Protect your account with 2FA
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} disabled>
              Setup
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px'
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f1419' }}>
                Change Password
              </p>
              <p style={{ fontSize: '12px', color: '#536471', marginTop: '4px' }}>
                Update your account password
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} disabled>
              Change
            </button>
          </div>
        </div>

        {/* My Posts Section */}
        {userPosts.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#0f1419', 
              marginBottom: '20px' 
            }}>
              My Posts
            </h3>
            {userPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: '#eff3f4',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {editingPostId === post.id ? (
                  <div style={{ marginBottom: '12px' }}>
                    <textarea
                      value={editPostContent}
                      onChange={(e) => setEditPostContent(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        border: '1px solid #1da1f2',
                        borderRadius: '8px',
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => handleSavePostEdit(post.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#1da1f2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelPostEdit}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#eff3f4',
                          color: '#0f1419',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 'bold', color: '#0f1419', fontSize: '15px', margin: 0, marginBottom: '4px' }}>
                          {post.userName || 'Unknown User'}
                        </p>
                        <p style={{ color: '#536471', fontSize: '13px', margin: 0, marginBottom: '8px' }}>
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown date'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleEditPost(post.id, post.content)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#1da1f2',
                            fontSize: '14px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          title="Edit post"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#d32f2f',
                            fontSize: '14px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          title="Delete post"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p style={{ color: '#0f1419', fontSize: '15px', lineHeight: '1.4', margin: 0 }}>
                      {post.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eff3f4' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ color: '#536471', fontSize: '13px', margin: 0 }}>
                          ♥️ {post.likes ? post.likes.length : 0}
                        </p>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ color: '#536471', fontSize: '13px', margin: 0 }}>
                          💬 {post.replies ? post.replies.length : 0}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!loadingPosts && userPosts.length === 0 && (
          <div style={{ 
            marginTop: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#536471', fontSize: '16px' }}>
              No posts yet. Start sharing your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}