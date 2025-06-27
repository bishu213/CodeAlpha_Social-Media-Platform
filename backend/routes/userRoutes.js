const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'Email already in use' });

  const user = new User({ username, email, password });
  await user.save();

  res.json({ msg: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Follow
router.post('/follow/:id', auth, async (req, res) => {
  const target = await User.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!target) return res.status(404).json({ msg: 'User not found' });
  if (user.following.includes(target._id)) return res.status(400).json({ msg: 'Already following' });

  user.following.push(target._id);
  target.followers.push(user._id);

  await user.save();
  await target.save();

  res.json({ msg: 'Followed' });
});

module.exports = router;


// Get logged-in user profile
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});





//

// Get all users (for suggestions)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('username');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;