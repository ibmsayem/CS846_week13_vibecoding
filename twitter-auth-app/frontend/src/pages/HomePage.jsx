import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/authService';
import '../styles.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  console.log('HomePage - user:', user);
  console.log('HomePage - loading:', loading);
  console.log('HomePage - posts:', posts);

  useEffect(() => {
    console.log('HomePage - useEffect1 - user:', user);
    if (!user) {
      console.log('HomePage - No user, navigating to login');
      navigate('/login');
    } else {
      console.log('HomePage - User found, setting loading false');
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log('HomePage - useEffect2 - Fetching posts, user:', user);
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/feed');
      console.log('Posts fetched:', response.data.data);
      setPosts(response.data.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      setError('Post cannot be empty');
      return;
    }

    setIsPosting(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      console.log('📤 Posting with token:', token ? `✅ ${token.slice(0, 20)}...` : '❌ NO TOKEN');
      
      const response = await api.post(
        '/posts',
        { content: newPostContent }
      );
      
      console.log('✅ Post created successfully');
      if (response.status === 201 || response.status === 200) {
        setNewPostContent('');
        await fetchPosts();
      }
    } catch (err) {
      console.error('❌ Failed to create post:', err.response?.status, err.response?.data);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`, {});
      fetchPosts();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleReplyToPost = async (postId) => {
    const content = replyContent[postId];
    if (!content || !content.trim()) return;

    try {
      await api.post(`/posts/${postId}/reply`, { content });
      setReplyContent({ ...replyContent, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post');
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      await api.delete(`/posts/${postId}/reply/${replyId}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete reply:', err);
      setError('Failed to delete reply');
    }
  };

  const handleEditPost = (postId, content) => {
    setEditingPostId(postId);
    setEditPostContent(content);
  };

  const handleSavePostEdit = async (postId) => {
    if (!editPostContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    try {
      await api.put(`/posts/${postId}`, { content: editPostContent });
      setEditingPostId(null);
      setEditPostContent('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to edit post:', err);
      setError('Failed to edit post');
    }
  };

  const handleCancelPostEdit = () => {
    setEditingPostId(null);
    setEditPostContent('');
  };

  const handleEditReply = (replyContent) => {
    setEditingReplyId(replyContent.id);
    setEditReplyContent(replyContent.content);
  };

  const handleSaveReplyEdit = async (postId, replyId) => {
    if (!editReplyContent.trim()) {
      setError('Reply content cannot be empty');
      return;
    }

    try {
      await api.put(`/posts/${postId}/reply/${replyId}`, { content: editReplyContent });
      setEditingReplyId(null);
      setEditReplyContent('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to edit reply:', err);
      setError('Failed to edit reply');
    }
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setEditReplyContent('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Helper to safely get user initial from post
  const getUserInitial = (post) => {
    if (!post || !post.userId) {
      console.warn('Post missing userId:', post);
      return '?';
    }
    return String(post.userId).charAt(0).toUpperCase();
  };

  // Helper to safely get user display name from stored users
  const getUserDisplayName = (post) => {
    if (!post || !post.userId) return 'Unknown User';
    if (post.userName) return post.userName;
    if (post.username) return post.username;
    return `User ${post.userId}`;
  };

  // Helper to check if current user has liked a post
  const hasUserLiked = (post) => {
    if (!post || !post.likes || !user) return false;
    // Check both id and userId since JWT uses userId but user object might have id
    return post.likes.includes(user.id) || post.likes.includes(user.userId);
  };

  if (loading || !user) {
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
        {/* Post Creation Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '20px',
          marginBottom: '20px',
          borderBottom: '2px solid #eff3f4'
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#1da1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', color: '#536471', marginBottom: '4px' }}>
                What's happening?!
              </p>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts with the world"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #eff3f4',
                  borderRadius: '8px',
                  fontFamily: 'inherit',
                  fontSize: '16px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || isPosting}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div>
          {posts.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#536471', fontSize: '16px', marginBottom: '12px' }}>
                No posts yet. Be the first to post!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '12px',
                  borderBottom: '1px solid #eff3f4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* Post Header */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#1da1f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => post.userId && navigate(`/user/${post.userId}`)}
                  >
                    {getUserInitial(post)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'flex-start' }}>
                      <div 
                        style={{ cursor: post.userId ? 'pointer' : 'default' }}
                        onClick={() => post.userId && navigate(`/user/${post.userId}`)}
                      >
                        <p style={{ fontWeight: 'bold', color: '#0f1419', fontSize: '15px', margin: 0 }}>
                          {getUserDisplayName(post)}
                        </p>
                        <p style={{ color: '#536471', fontSize: '13px', margin: 0 }}>
                          @{post.userName || 'unknown'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <p style={{ color: '#536471', fontSize: '13px', margin: 0 }}>
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'} 
                        </p>
                        {post.userId === user.id && (
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
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
                  <p style={{ color: '#0f1419', fontSize: '15px', lineHeight: '1.5', marginBottom: '12px' }}>
                    {post.content}
                  </p>
                )}

                {/* Post Actions */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  paddingTop: '12px',
                  borderTop: '1px solid #eff3f4',
                  marginBottom: '12px'
                }}>
                  <button
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#536471',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    💬 {post.replies?.length || 0}
                  </button>
                  <button
                    onClick={() => handleLikePost(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: hasUserLiked(post) ? '#e74c3c' : '#536471',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {hasUserLiked(post) ? '❤️' : '🤍'} {post.likes?.length || 0}
                  </button>
                </div>

                {/* Replies Section */}
                {expandedPostId === post.id && (
                  <div style={{ backgroundColor: '#f7f9fa', padding: '12px', borderRadius: '8px' }}>
                    {/* Reply Form */}
                    <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                        placeholder="Reply to this post..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #eff3f4',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                      <button
                        onClick={() => handleReplyToPost(post.id)}
                        disabled={!replyContent[post.id]?.trim()}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#1da1f2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        Reply
                      </button>
                    </div>

                    {/* Display Replies */}
                    {post.replies && post.replies.length > 0 && (
                      <div style={{ borderTop: '1px solid #eff3f4', paddingTop: '12px' }}>
                        {post.replies.map((reply) => (
                          <div
                            key={reply.id}
                            style={{
                              marginBottom: '12px',
                              padding: '8px',
                              backgroundColor: 'white',
                              borderRadius: '6px',
                              borderLeft: '2px solid #1da1f2'
                            }}
                          >
                            {editingReplyId === reply.id ? (
                              <div>
                                <textarea
                                  value={editReplyContent}
                                  onChange={(e) => setEditReplyContent(e.target.value)}
                                  style={{
                                    width: '100%',
                                    minHeight: '60px',
                                    padding: '8px',
                                    border: '1px solid #1da1f2',
                                    borderRadius: '6px',
                                    fontFamily: 'inherit',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                    marginBottom: '8px'
                                  }}
                                />
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    onClick={() => handleSaveReplyEdit(post.id, reply.id)}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#1da1f2',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelReplyEdit}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#eff3f4',
                                      color: '#0f1419',
                                      border: '1px solid #ccc',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                                  <p style={{ fontWeight: 'bold', color: '#0f1419', fontSize: '13px', margin: 0 }}>
                                    {reply.userName || 'Unknown User'}
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {reply.userId === user.id && (
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                          onClick={() => handleEditReply(reply)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#1da1f2',
                                            fontSize: '11px',
                                            padding: '2px 4px',
                                            borderRadius: '3px',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onMouseEnter={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                          title="Edit reply"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => handleDeleteReply(post.id, reply.id)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#d32f2f',
                                            fontSize: '11px',
                                            padding: '2px 4px',
                                            borderRadius: '3px',
                                            transition: 'background-color 0.2s'
                                          }}
                                          onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                          title="Delete reply"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p style={{ color: '#0f1419', fontSize: '13px', lineHeight: '1.4', margin: 0 }}>
                                  {reply.content}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}