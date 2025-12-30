const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const pool = require('../config/database');

const router = express.Router();

// Webhook verification (GET request from Instagram)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook event handler (POST request from Instagram)
router.post('/', async (req, res) => {
  try {
    // Verify webhook signature (optional but recommended)
    const signature = req.headers['x-hub-signature-256'];
    if (signature) {
      const hash = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (`sha256=${hash}` !== signature) {
        console.error('Invalid webhook signature');
        return res.sendStatus(403);
      }
    }

    // Instagram sends events in this format
    const entries = req.body.entry || [];
    
    for (const entry of entries) {
      const instagramAccountId = entry.id;
      
      // Find brand by Instagram account ID
      const [accounts] = await pool.execute(
        'SELECT brand_id, id FROM instagram_accounts WHERE instagram_business_account_id = ? AND is_connected = TRUE',
        [instagramAccountId]
      );

      if (accounts.length === 0) {
        console.log(`No brand found for Instagram account: ${instagramAccountId}`);
        continue;
      }

      const { brand_id, id: instagram_account_id } = accounts[0];

      // Process comments
      const comments = entry.comments?.data || [];
      for (const comment of comments) {
        await processComment(comment, brand_id, instagram_account_id);
      }

      // Process mentions (if any)
      const mentions = entry.mentions?.data || [];
      for (const mention of mentions) {
        await processMention(mention, brand_id, instagram_account_id);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(500);
  }
});

async function processComment(comment, brandId, instagramAccountId) {
  try {
    // Check if comment already exists
    const [existing] = await pool.execute(
      'SELECT id FROM comments WHERE comment_id = ?',
      [comment.id]
    );

    if (existing.length > 0) {
      return; // Comment already processed
    }

    // Insert new comment
    await pool.execute(
      `INSERT INTO comments 
       (brand_id, instagram_account_id, comment_id, media_id, parent_id, text, username, user_id, timestamp, like_count, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      [
        brandId,
        instagramAccountId,
        comment.id,
        comment.media?.id || null,
        comment.parent_id || null,
        comment.text || '',
        comment.from?.username || 'unknown',
        comment.from?.id || '',
        comment.timestamp ? new Date(comment.timestamp) : new Date(),
        comment.like_count || 0
      ]
    );

    console.log(`Comment processed: ${comment.id} for brand ${brandId}`);
  } catch (error) {
    console.error('Error processing comment:', error);
  }
}

async function processMention(mention, brandId, instagramAccountId) {
  try {
    // Mentions are similar to comments but may have different structure
    // For MVP, we'll treat mentions as comments
    await processComment(mention, brandId, instagramAccountId);
  } catch (error) {
    console.error('Error processing mention:', error);
  }
}

module.exports = router;

