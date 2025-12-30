const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Get all brands
router.get('/brands', async (req, res) => {
  try {
    const { category, is_active, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM brands WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [brands] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM brands WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (is_active !== undefined) {
      countQuery += ' AND is_active = ?';
      countParams.push(is_active === 'true');
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      brands,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single brand with details
router.get('/brands/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    const [brands] = await pool.execute(
      'SELECT * FROM brands WHERE id = ?',
      [brandId]
    );

    if (brands.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Get Instagram accounts
    const [accounts] = await pool.execute(
      'SELECT * FROM instagram_accounts WHERE brand_id = ?',
      [brandId]
    );

    // Get users
    const [users] = await pool.execute(
      'SELECT id, email, role, full_name, created_at FROM users WHERE brand_id = ?',
      [brandId]
    );

    // Get comment stats
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_comments,
        SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) as open_comments,
        SUM(CASE WHEN status = 'REPLIED' THEN 1 ELSE 0 END) as replied_comments
       FROM comments
       WHERE brand_id = ?`,
      [brandId]
    );

    res.json({
      brand: brands[0],
      instagram_accounts: accounts,
      users,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Get brand details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create brand
router.post('/brands',
  [
    body('name').notEmpty().trim(),
    body('category').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category } = req.body;

      const [result] = await pool.execute(
        'INSERT INTO brands (name, category) VALUES (?, ?)',
        [name, category || null]
      );

      // Log activity
      await pool.execute(
        `INSERT INTO admin_activity_logs (admin_user_id, action_type, target_type, target_id, details)
         VALUES (?, 'CREATE', 'BRAND', ?, ?)`,
        [req.user.id, result.insertId, JSON.stringify({ name, category })]
      );

      res.status(201).json({ 
        message: 'Brand created successfully',
        brand_id: result.insertId
      });
    } catch (error) {
      console.error('Create brand error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update brand
router.put('/brands/:brandId',
  [
    body('name').optional().notEmpty().trim(),
    body('category').optional().trim(),
    body('is_active').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { brandId } = req.params;
      const { name, category, is_active } = req.body;

      // Get current brand
      const [brands] = await pool.execute(
        'SELECT * FROM brands WHERE id = ?',
        [brandId]
      );

      if (brands.length === 0) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      const updates = [];
      const params = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      if (category !== undefined) {
        updates.push('category = ?');
        params.push(category);
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        params.push(is_active);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      params.push(brandId);
      await pool.execute(
        `UPDATE brands SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        params
      );

      // Log activity
      await pool.execute(
        `INSERT INTO admin_activity_logs (admin_user_id, action_type, target_type, target_id, details)
         VALUES (?, 'UPDATE', 'BRAND', ?, ?)`,
        [req.user.id, brandId, JSON.stringify({ name, category, is_active })]
      );

      res.json({ message: 'Brand updated successfully' });
    } catch (error) {
      console.error('Update brand error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Enable/Disable brand
router.patch('/brands/:brandId/status', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be a boolean' });
    }

    await pool.execute(
      'UPDATE brands SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_active, brandId]
    );

    // Log activity
    await pool.execute(
      `INSERT INTO admin_activity_logs (admin_user_id, action_type, target_type, target_id, details)
       VALUES (?, ?, 'BRAND', ?, ?)`,
      [
        req.user.id,
        is_active ? 'ENABLE' : 'DISABLE',
        brandId,
        JSON.stringify({ is_active })
      ]
    );

    res.json({ message: `Brand ${is_active ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    console.error('Update brand status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity logs
router.get('/logs', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const [logs] = await pool.execute(
      `SELECT al.*, u.email as admin_email
       FROM admin_activity_logs al
       JOIN users u ON al.admin_user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM admin_activity_logs');
    const total = countResult[0].total;

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reconnect Instagram account (admin assist)
router.post('/brands/:brandId/instagram/reconnect', async (req, res) => {
  try {
    const { brandId } = req.params;

    // Get Instagram account
    const [accounts] = await pool.execute(
      'SELECT * FROM instagram_accounts WHERE brand_id = ? LIMIT 1',
      [brandId]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'No Instagram account found for this brand' });
    }

    // Log activity
    await pool.execute(
      `INSERT INTO admin_activity_logs (admin_user_id, action_type, target_type, target_id, details)
       VALUES (?, 'RECONNECT_INSTAGRAM', 'BRAND', ?, ?)`,
      [req.user.id, brandId, JSON.stringify({ instagram_account_id: accounts[0].id })]
    );

    res.json({ 
      message: 'Reconnection initiated',
      auth_url: `${process.env.FRONTEND_URL}/instagram/connect?brand_id=${brandId}`
    });
  } catch (error) {
    console.error('Reconnect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

