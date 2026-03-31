import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/authService';
import '../styles.css';

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUserProfile(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await api.get(`/posts/user/${userId}`);
        setUserPosts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

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
      // Update the post in the local state
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#536471' }}>Loading...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#536471' }}>User not found</p>
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
      {/* Navigation */}
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
              onClick={() => navigate('/profile')}
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-secondary"
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Settings
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
              {userProfile.username.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile Info */}
          <div style={{ padding: '60px 20px 20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f1419', marginBottom: '4px' }}>
                {userProfile.firstName && userProfile.lastName
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : userProfile.username}
              </h2>
              <p style={{ fontSize: '15px', color: '#536471', marginBottom: '20px' }}>@{userProfile.username}</p>
            </div>

            {/* User Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              padding: '16px 0',
              borderTop: '1px solid #eff3f4',
              borderBottom: '1px solid #eff3f4'
            }}>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419' }}>
                  {userPosts.length}
                </p>
                <p style={{ fontSize: '13px', color: '#536471' }}>Posts</p>
              </div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f1419' }}>Joined</p>
                <p style={{ fontSize: '13px', color: '#536471' }}>
                  {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div style={{ paddingTop: '16px' }}>
              <p style={{ fontSize: '15px', color: '#0f1419', marginBottom: '12px' }}>
                <strong>Email:</strong> {userProfile.email}
              </p>
              <p style={{ fontSize: '13px', color: '#536471' }}>
                Account Status: {userProfile.isVerified ? '✓ Verified' : '✓ Verified'}
              </p>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#0f1419',
            marginBottom: '16px'
          }}>
            Posts
          </h3>

          {userPosts.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#536471', fontSize: '16px' }}>
                This user hasn't posted anything yet.
              </p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '12px',
                  borderBottom: '1px solid #eff3f4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1da1f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {userProfile.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#0f1419', fontSize: '14px', margin: 0 }}>
                          {userProfile.firstName && userProfile.lastName
                            ? `${userProfile.firstName} ${userProfile.lastName}`
                            : userProfile.username}
                        </p>
                        <p style={{ color: '#536471', fontSize: '12px', margin: 0 }}>
                          @{userProfile.username}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ color: '#536471', fontSize: '12px', margin: 0 }}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        {(currentUser?.userId === userId || currentUser?.id === userId) && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleEditPost(post.id, post.content)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#1da1f2',
                                fontSize: '12px',
                                padding: '2px 4px',
                                borderRadius: '3px',
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
                                fontSize: '12px',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              title="Delete post"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#0f1419', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
                  {editingPostId === post.id ? (
                    <div>
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
                          fontSize: '14px',
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
                    post.content
                  )}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  paddingTop: '8px',
                  borderTop: '1px solid #eff3f4',
                  fontSize: '12px',
                  color: '#536471'
                }}>
                  <span>💬 {post.replies?.length || 0}</span>
                  <span>{post.likes?.includes(currentUser?.id) ? '❤️' : '🤍'} {post.likes?.length || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}