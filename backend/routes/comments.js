const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authenticate, requireRole, requireBrandAccess } = require('../middleware/auth');

const router = express.Router();

// Get all comments for brand (unified inbox)
router.get('/', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const brandId = req.user.brand_id;

    let query = `
      SELECT c.*, ia.username as account_username
      FROM comments c
      JOIN instagram_accounts ia ON c.instagram_account_id = ia.id
      WHERE c.brand_id = ?
    `;
    const params = [brandId];

    if (status && (status === 'OPEN' || status === 'REPLIED')) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.timestamp DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [comments] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM comments WHERE brand_id = ?';
    const countParams = [brandId];
    
    if (status && (status === 'OPEN' || status === 'REPLIED')) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      comments,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single comment with replies
router.get('/:commentId', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const { commentId } = req.params;
    const brandId = req.user.brand_id;

    const [comments] = await pool.execute(
      `SELECT c.*, ia.username as account_username
       FROM comments c
       JOIN instagram_accounts ia ON c.instagram_account_id = ia.id
       WHERE c.id = ? AND c.brand_id = ?`,
      [commentId, brandId]
    );

    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Get replies
    const [replies] = await pool.execute(
      `SELECT r.*, u.full_name as replied_by
       FROM replies r
       JOIN users u ON r.user_id = u.id
       WHERE r.comment_id = ?
       ORDER BY r.sent_at DESC`,
      [commentId]
    );

    res.json({
      comment: comments[0],
      replies
    });
  } catch (error) {
    console.error('Get comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reply to a comment
router.post('/:commentId/reply', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const brandId = req.user.brand_id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    // Get comment and verify it belongs to the brand
    const [comments] = await pool.execute(
      `SELECT c.*, ia.page_access_token, ia.instagram_business_account_id
       FROM comments c
       JOIN instagram_accounts ia ON c.instagram_account_id = ia.id
       WHERE c.id = ? AND c.brand_id = ?`,
      [commentId, brandId]
    );

    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = comments[0];

    // Send reply via Instagram Graph API
    let replyId;
    try {
      const replyResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${comment.comment_id}/replies`,
        {
          message: text
        },
        {
          params: {
            access_token: comment.page_access_token
          }
        }
      );

      replyId = replyResponse.data.id;
    } catch (apiError) {
      console.error('Instagram API error:', apiError.response?.data || apiError.message);
      return res.status(500).json({ 
        error: 'Failed to send reply to Instagram',
        details: apiError.response?.data || apiError.message
      });
    }

    // Store reply in database
    await pool.execute(
      `INSERT INTO replies (comment_id, brand_id, user_id, reply_id, text)
       VALUES (?, ?, ?, ?, ?)`,
      [commentId, brandId, req.user.id, replyId, text]
    );

    // Update comment status to REPLIED
    await pool.execute(
      'UPDATE comments SET status = "REPLIED", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [commentId]
    );

    res.json({ 
      message: 'Reply sent successfully',
      reply_id: replyId
    });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch comments manually (sync)
router.post('/sync', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const brandId = req.user.brand_id;

    // Get Instagram account
    const [accounts] = await pool.execute(
      `SELECT id, instagram_business_account_id, page_access_token
       FROM instagram_accounts
       WHERE brand_id = ? AND is_connected = TRUE
       LIMIT 1`,
      [brandId]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }

    const account = accounts[0];

    // Fetch recent media
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${account.instagram_business_account_id}/media`,
      {
        params: {
          access_token: account.page_access_token,
          fields: 'id,comments',
          limit: 25
        }
      }
    );

    let commentCount = 0;
    for (const media of mediaResponse.data.data || []) {
      if (media.comments?.data) {
        for (const comment of media.comments.data) {
          // Check if comment exists
          const [existing] = await pool.execute(
            'SELECT id FROM comments WHERE comment_id = ?',
            [comment.id]
          );

          if (existing.length === 0) {
            await pool.execute(
              `INSERT INTO comments 
               (brand_id, instagram_account_id, comment_id, media_id, text, username, user_id, timestamp, like_count, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
              [
                brandId,
                account.id,
                comment.id,
                media.id,
                comment.text || '',
                comment.from?.username || 'unknown',
                comment.from?.id || '',
                comment.timestamp ? new Date(comment.timestamp) : new Date(),
                comment.like_count || 0
              ]
            );
            commentCount++;
          }
        }
      }
    }

    // Update last sync time
    await pool.execute(
      'UPDATE instagram_accounts SET last_sync_at = CURRENT_TIMESTAMP WHERE id = ?',
      [account.id]
    );

    res.json({ 
      message: 'Sync completed',
      comments_added: commentCount
    });
  } catch (error) {
    console.error('Sync error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Sync failed',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;

