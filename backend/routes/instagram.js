const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authenticate, requireRole, requireBrandAccess } = require('../middleware/auth');

const router = express.Router();

// Get Instagram OAuth URL
router.get('/connect-url', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI);
    const state = Buffer.from(JSON.stringify({ brand_id: req.user.brand_id, user_id: req.user.id })).toString('base64');
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement&state=${state}&response_type=code`;
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Get connect URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/instagram/connect?error=no_code`);
    }

    // Decode state to get brand_id and user_id
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { brand_id, user_id } = stateData;

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user's pages
    const pagesResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: {
        access_token,
        fields: 'id,name,access_token,instagram_business_account'
      }
    });

    const pages = pagesResponse.data.data;
    
    // For MVP, we'll use the first page with Instagram Business account
    // In production, you'd let the user select which page
    const pageWithInstagram = pages.find(page => page.instagram_business_account);
    
    if (!pageWithInstagram) {
      return res.redirect(`${process.env.FRONTEND_URL}/instagram/connect?error=no_instagram_account`);
    }

    const pageId = pageWithInstagram.id;
    const pageAccessToken = pageWithInstagram.access_token;
    const instagramAccountId = pageWithInstagram.instagram_business_account.id;

    // Get Instagram account details
    const igResponse = await axios.get(`https://graph.facebook.com/v18.0/${instagramAccountId}`, {
      params: {
        access_token: pageAccessToken,
        fields: 'username,profile_picture_url'
      }
    });

    // Store or update Instagram account
    await pool.execute(
      `INSERT INTO instagram_accounts 
       (brand_id, instagram_business_account_id, facebook_page_id, page_access_token, username, profile_picture_url, is_connected)
       VALUES (?, ?, ?, ?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE
       page_access_token = VALUES(page_access_token),
       username = VALUES(username),
       profile_picture_url = VALUES(profile_picture_url),
       is_connected = TRUE,
       updated_at = CURRENT_TIMESTAMP`,
      [
        brand_id,
        instagramAccountId,
        pageId,
        pageAccessToken,
        igResponse.data.username,
        igResponse.data.profile_picture_url
      ]
    );

    res.redirect(`${process.env.FRONTEND_URL}/instagram/connect?success=true`);
  } catch (error) {
    console.error('OAuth callback error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/instagram/connect?error=connection_failed`);
  }
});

// Get connected Instagram account
router.get('/account', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    const [accounts] = await pool.execute(
      `SELECT id, instagram_business_account_id, username, profile_picture_url, 
       is_connected, last_sync_at, created_at
       FROM instagram_accounts 
       WHERE brand_id = ? AND is_connected = TRUE
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.brand_id]
    );

    if (accounts.length === 0) {
      return res.status(404).json({ error: 'No Instagram account connected' });
    }

    res.json({ account: accounts[0] });
  } catch (error) {
    console.error('Get Instagram account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Disconnect Instagram account
router.post('/disconnect', authenticate, requireRole('BRAND_USER'), async (req, res) => {
  try {
    await pool.execute(
      'UPDATE instagram_accounts SET is_connected = FALSE WHERE brand_id = ?',
      [req.user.brand_id]
    );

    res.json({ message: 'Instagram account disconnected' });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

