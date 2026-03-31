const Post = require("../models/Post");
const User = require("../models/User");

// Helper to attach user info to reply
const attachUserInfoToReply = async (reply) => {
  if (!reply) return reply;
  
  try {
    const user = await User.findUserById(reply.userId);
    if (user && !reply.userName) {
      return {
        ...reply,
        userName: user.username,
        userEmail: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }
  } catch (error) {
    console.error('Error attaching user info to reply:', error);
  }
  
  return reply;
};

// Helper to attach user info to post
const attachUserInfo = async (post) => {
  if (!post) return post;
  
  try {
    const user = await User.findUserById(post.userId);
    if (user) {
      return {
        ...post,
        userName: user.username,
        userEmail: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }
  } catch (error) {
    console.error('Error attaching user info:', error);
  }
  
  return post;
};

// Controller to create a new post
exports.createPost = async (req, res) => {
  const userId = req.user.userId; // Get userId from JWT token
  const { content } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ success: false, message: "Content cannot be empty" });
  }

  try {
    // Get user information first
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create post with user information included
    const newPost = Post.createPost({ 
      userId, 
      content,
      userName: user.username,
      userEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
    return res.status(201).json({ success: true, message: "Post created successfully", data: newPost });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = Post.getAllPosts();
    
    // Ensure user info is attached to each post and its replies
    const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
      let updatedPost = post;
      if (!post.userName) {
        updatedPost = await attachUserInfo(post);
      }
      
      // Attach user info to replies
      if (updatedPost.replies && updatedPost.replies.length > 0) {
        updatedPost.replies = await Promise.all(
          updatedPost.replies.map(reply => attachUserInfoToReply(reply))
        );
      }
      
      return updatedPost;
    }));
    
    return res.status(200).json({ success: true, data: postsWithUserInfo });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to get posts in chronological order
exports.getChronologicalFeed = (req, res) => {
  try {
    const posts = Post.getAllPosts(); // Already sorted by createdAt in descending order
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to like/unlike a post
exports.likePost = (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  try {
    const post = Post.likePost(parseInt(postId), userId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    return res.status(200).json({ success: true, message: "Post liked/unliked", data: post });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to reply to a post
exports.replyToPost = async (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ success: false, message: "Reply content cannot be empty" });
  }

  try {
    const reply = Post.replyToPost(parseInt(postId), userId, content);
    if (!reply) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    // Attach user info to reply
    let replyWithUserInfo = reply;
    try {
      const user = await User.findUserById(userId);
      if (user) {
        replyWithUserInfo = {
          ...reply,
          userName: user.username,
          userEmail: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    } catch (userError) {
      console.error('Error attaching user info to reply:', userError);
    }
    
    return res.status(201).json({ success: true, message: "Reply added successfully", data: replyWithUserInfo });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to get user's posts
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = Post.getUserPosts(userId);
    
    // Ensure user info is attached to each post and its replies
    const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
      let updatedPost = post;
      if (!post.userName) {
        updatedPost = await attachUserInfo(post);
      }
      
      // Attach user info to replies
      if (updatedPost.replies && updatedPost.replies.length > 0) {
        updatedPost.replies = await Promise.all(
          updatedPost.replies.map(reply => attachUserInfoToReply(reply))
        );
      }
      
      return updatedPost;
    }));
    
    return res.status(200).json({ success: true, data: postsWithUserInfo });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to delete a post
exports.deletePost = (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  try {
    const result = Post.deletePost(parseInt(postId), userId);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    if (result.error) {
      return res.status(403).json({ success: false, message: result.error });
    }
    
    return res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to delete a reply
exports.deleteReply = (req, res) => {
  const userId = req.user.userId;
  const { postId, replyId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  try {
    const result = Post.deleteReply(parseInt(postId), parseInt(replyId), userId);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }
    
    if (result.error) {
      return res.status(403).json({ success: false, message: result.error });
    }
    
    return res.status(200).json({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to edit a post
exports.editPost = (req, res) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  const { content } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ success: false, message: "Content cannot be empty" });
  }

  try {
    const result = Post.editPost(parseInt(postId), userId, content);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    if (result.error) {
      return res.status(403).json({ success: false, message: result.error });
    }
    
    return res.status(200).json({ success: true, message: "Post edited successfully", data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to edit a reply
exports.editReply = (req, res) => {
  const userId = req.user.userId;
  const { postId, replyId } = req.params;
  const { content } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID not found in token" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ success: false, message: "Content cannot be empty" });
  }

  try {
    const result = Post.editReply(parseInt(postId), parseInt(replyId), userId, content);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }
    
    if (result.error) {
      return res.status(403).json({ success: false, message: result.error });
    }
    
    return res.status(200).json({ success: true, message: "Reply edited successfully", data: result.data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};