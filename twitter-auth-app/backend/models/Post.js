const posts = [];

class Post {
  constructor({ id, userId, content, createdAt, userName, userEmail, firstName, lastName }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;  // Store username for quick access
    this.userEmail = userEmail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.content = content;
    this.createdAt = createdAt;
    this.likes = [];
    this.replies = [];
  }

  static createPost({ userId, content, userName, userEmail, firstName, lastName }) {
    const newPost = new Post({
      id: posts.length + 1,
      userId,
      content,
      createdAt: new Date(),
      userName,
      userEmail,
      firstName,
      lastName
    });
    posts.push(newPost);
    return newPost;
  }

  static getAllPosts() {
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  }

  static getPostById(postId) {
    return posts.find((post) => post.id === postId);
  }

  static likePost(postId, userId) {
    const post = this.getPostById(postId);
    if (!post) return null;

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }
    return post;
  }

  static replyToPost(postId, userId, content) {
    const post = this.getPostById(postId);
    if (!post) return null;

    const reply = {
      id: post.replies.length + 1,
      userId,
      content,
      createdAt: new Date(),
      likes: []
    };
    post.replies.push(reply);
    return reply;
  }

  static deletePost(postId, userId) {
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return null;

    const post = posts[postIndex];
    // Only allow deletion by the post creator
    if (post.userId !== userId) {
      return { error: 'Unauthorized: Only the post creator can delete this post' };
    }

    posts.splice(postIndex, 1);
    return { success: true, message: 'Post deleted successfully' };
  }

  static deleteReply(postId, replyId, userId) {
    const post = this.getPostById(postId);
    if (!post) return null;

    const replyIndex = post.replies.findIndex((reply) => reply.id === replyId);
    if (replyIndex === -1) return null;

    const reply = post.replies[replyIndex];
    // Only allow deletion by the reply creator
    if (reply.userId !== userId) {
      return { error: 'Unauthorized: Only the reply creator can delete this reply' };
    }

    post.replies.splice(replyIndex, 1);
    return { success: true, message: 'Reply deleted successfully' };
  }

  static editPost(postId, userId, content) {
    const post = this.getPostById(postId);
    if (!post) return null;

    // Only allow editing by the post creator
    if (post.userId !== userId) {
      return { error: 'Unauthorized: Only the post creator can edit this post' };
    }

    if (!content || content.trim() === '') {
      return { error: 'Post content cannot be empty' };
    }

    post.content = content;
    post.updatedAt = new Date();
    return { success: true, message: 'Post edited successfully', data: post };
  }

  static editReply(postId, replyId, userId, content) {
    const post = this.getPostById(postId);
    if (!post) return null;

    const reply = post.replies.find((r) => r.id === replyId);
    if (!reply) return null;

    // Only allow editing by the reply creator
    if (reply.userId !== userId) {
      return { error: 'Unauthorized: Only the reply creator can edit this reply' };
    }

    if (!content || content.trim() === '') {
      return { error: 'Reply content cannot be empty' };
    }

    reply.content = content;
    reply.updatedAt = new Date();
    return { success: true, message: 'Reply edited successfully', data: reply };
  }

  static getUserPosts(userId) {
    return posts.filter((post) => post.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  }
}

module.exports = Post;