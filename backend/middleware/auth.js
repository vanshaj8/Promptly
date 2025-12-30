const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    const [users] = await pool.execute(
      'SELECT id, email, role, brand_id FROM users WHERE id = ?',
      [decoded.user_id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireBrandAccess = async (req, res, next) => {
  try {
    // Admin can access any brand
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Brand users can only access their own brand
    const brandId = req.params.brandId || req.body.brand_id || req.query.brand_id;
    
    if (brandId && parseInt(brandId) !== req.user.brand_id) {
      return res.status(403).json({ error: 'Access denied to this brand' });
    }

    // For brand users, automatically filter by their brand_id
    req.user.brand_id_filter = req.user.brand_id;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authorization error' });
  }
};

module.exports = {
  authenticate,
  requireRole,
  requireBrandAccess
};

