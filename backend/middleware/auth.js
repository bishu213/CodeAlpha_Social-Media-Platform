const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  let header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token' });

  // If header starts with Bearer, remove it
  if (header.startsWith('Bearer ')) {
    header = header.replace('Bearer ', '');
  }

  const token = header.trim();
  if (!token) return res.status(401).json({ msg: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ msg: 'User not found' });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Invalid token' });
  }
};
