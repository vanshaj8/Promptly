# Quick Start Guide

## Prerequisites Check
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Facebook App created with Instagram Graph API access

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE promptly_db;"

# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

### 3. Run Migrations
```bash
cd backend
npm run migrate
```

### 4. Generate Password Hash (for seed users)
```bash
cd backend
node scripts/generate-password.js admin123
# Use the generated hash in database/seed.sql if you want to change the default password
```

### 5. Configure Frontend
```bash
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local if needed (defaults should work)
```

### 6. Start Development Servers
```bash
# From project root
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

## First Login

After running migrations, use these default credentials:

- **Admin**: `admin@promptly.com` / `admin123`
- **Brand User**: `brand@demo.com` / `admin123`

⚠️ **Change these passwords in production!**

## Next Steps

1. **Set up Facebook/Instagram App**:
   - Go to https://developers.facebook.com/
   - Create app with Instagram Graph API
   - Add redirect URI: `http://localhost:3001/api/auth/instagram/callback`
   - Get App ID and App Secret
   - Update `backend/.env`

2. **Connect Instagram Account**:
   - Login as brand user
   - Go to Instagram settings
   - Click "Connect Instagram Account"
   - Complete OAuth flow

3. **Set up Webhooks** (for real-time updates):
   - In Facebook App settings, add webhook URL: `http://your-domain.com/api/webhooks`
   - Verify token: Use `WEBHOOK_VERIFY_TOKEN` from `.env`
   - Subscribe to `instagram` events

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/.env`
- Ensure database exists: `SHOW DATABASES;`

### Instagram OAuth Not Working
- Verify Facebook App ID and Secret in `.env`
- Check redirect URI matches exactly
- Ensure Instagram Business account is connected to Facebook Page

### Webhook Not Receiving Events
- Verify webhook URL is publicly accessible (use ngrok for local dev)
- Check webhook verify token matches
- Ensure webhook is subscribed to correct events

## Development Tips

- Backend logs: Check terminal running `npm run dev:backend`
- Frontend logs: Check browser console
- Database: Use MySQL client or GUI tool to inspect data
- API testing: Use Postman or curl to test endpoints

## Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Set up proper database backups
- [ ] Configure HTTPS
- [ ] Set up proper webhook endpoint (not localhost)
- [ ] Review and update CORS settings
- [ ] Set up monitoring and logging
- [ ] Review security settings

