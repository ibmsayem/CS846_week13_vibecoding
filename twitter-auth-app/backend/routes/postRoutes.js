const express = require("express");
const { createPost, getAllPosts, likePost, replyToPost, getUserPosts, deletePost, deleteReply, editPost, editReply } = require("../controllers/postController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Route to get posts in chronological order (must be before /:postId routes)
router.get("/feed", getAllPosts);

// Route to get user's posts (must be before /:postId routes)
router.get("/user/:userId", getUserPosts);

// Route to create a new post
router.post("/", authenticate, createPost);

// Route to get all posts
router.get("/", getAllPosts);

// Routes with :postId parameter
router.post("/:postId/like", authenticate, likePost);
router.post("/:postId/reply", authenticate, replyToPost);
router.put("/:postId", authenticate, editPost);
router.delete("/:postId/reply/:replyId", authenticate, deleteReply);
router.put("/:postId/reply/:replyId", authenticate, editReply);
router.delete("/:postId", authenticate, deletePost);

module.exports = router;