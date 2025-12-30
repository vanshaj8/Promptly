const express = require('express');
const pool = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get brand info (for brand users)
router.get('/me', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const [brands] = await pool.execute(
      'SELECT id, name, category, is_active, created_at FROM brands WHERE id = ?',
      [req.user.brand_id]
    );

    if (brands.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ brand: brands[0] });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

