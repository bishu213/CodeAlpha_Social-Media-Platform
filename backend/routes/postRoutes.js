const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const auth = require('../middleware/auth');

// Create Post
router.post('/', auth, async (req, res) => {
  const post = new Post({
    content: req.body.content,
    author: req.user._id
  });
  await post.save();
  res.json(post);
});

// Get all Posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Add Comment
router.post('/:postId/comments', auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ msg: 'Post not found' });

  const comment = new Comment({
    content: req.body.content,
    author: req.user._id,
    post: post._id
  });
  await comment.save();

  res.json(comment);
});

// Get posts by the logged-in user
router.get('/me', auth, async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;
