const User = require('../models/user.Model');
const jwt = require('jsonwebtoken');

module.exports.adminMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthorized: No token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access Denied: Admins only' });
    }

    req.user = user; // attach user to request if needed
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
