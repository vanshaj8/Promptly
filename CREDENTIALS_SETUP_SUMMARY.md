# Credentials Setup Summary

## 🔑 Required Credentials

### ✅ Already Configured
- **Database**: Connected (password: `Vanshaj@8`)
- **Server Port**: 3001
- **Frontend URL**: http://localhost:3000

### ❌ You Need to Provide

#### 1. Facebook App Credentials (REQUIRED for Instagram integration)

**Get these from:** [developers.facebook.com](https://developers.facebook.com/)

1. **Facebook App ID**
   - Create app → Settings → Basic → App ID
   - Looks like: `1234567890123456`

2. **Facebook App Secret**
   - Settings → Basic → App Secret (click "Show")
   - Looks like: `abc123def456ghi789jkl012mno345pq`

**Quick Setup Steps:**
1. Go to https://developers.facebook.com/
2. Click "My Apps" → "Create App"
3. Select "Business" type
4. Add "Instagram Graph API" product
5. Go to Settings → Basic
6. Copy App ID and App Secret

#### 2. JWT Secret (REQUIRED for authentication)

**Generated for you:** `C8Nu4S896cCNfGmediPWnbhqVhcxbT8R+an3l26nrk0=`

This is a secure random key for JWT token signing. You can use this one or generate your own.

#### 3. Webhook Tokens (OPTIONAL - only if using webhooks)

- **Webhook Verify Token**: Any random string (e.g., `my_webhook_token_123`)
- **Webhook Secret**: Another random string (e.g., `my_webhook_secret_456`)

---

## 📝 Configuration Steps

### Step 1: Update `backend/src/main/resources/application.properties`

Replace these lines:

```properties
# JWT Configuration
jwt.secret=C8Nu4S896cCNfGmediPWnbhqVhcxbT8R+an3l26nrk0=

# Instagram/Facebook OAuth Configuration
facebook.app.id=YOUR_FACEBOOK_APP_ID_HERE
facebook.app.secret=YOUR_FACEBOOK_APP_SECRET_HERE

# Webhook Configuration (Optional - can use placeholders)
webhook.verify.token=your_webhook_verify_token
webhook.secret=your_webhook_secret
```

### Step 2: Facebook App Configuration

In your Facebook App settings:

1. **Add Redirect URI:**
   - Go to Products → Instagram → Basic Display
   - Add to "Valid OAuth Redirect URIs":
     ```
     http://localhost:3001/api/instagram/callback
     ```

2. **Request Permissions:**
   - `instagram_basic`
   - `instagram_manage_comments`
   - `pages_show_list`
   - `pages_read_engagement`

3. **Add Test Users (for development):**
   - Go to Roles → Roles
   - Add yourself as Administrator or Developer

### Step 3: Instagram Account Setup

- Ensure your Instagram account is **Business** or **Creator** type
- Link it to a **Facebook Page**

---

## ✅ Quick Checklist

- [ ] Created Facebook App
- [ ] Got Facebook App ID
- [ ] Got Facebook App Secret
- [ ] Updated `application.properties` with App ID
- [ ] Updated `application.properties` with App Secret
- [ ] Updated `application.properties` with JWT secret (already generated above)
- [ ] Added redirect URI in Facebook App settings
- [ ] Requested required permissions
- [ ] Instagram account is Business/Creator type
- [ ] Instagram account linked to Facebook Page

---

## 🚀 After Configuration

1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Connection:**
   - Log in to the app
   - Go to Instagram settings
   - Click "Connect Instagram"
   - Complete OAuth flow

---

## 📚 Full Documentation

- **Detailed Setup**: [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md)
- **Quick Reference**: [INSTAGRAM_QUICK_START.md](./INSTAGRAM_QUICK_START.md)
- **All Credentials**: [REQUIRED_CREDENTIALS.md](./REQUIRED_CREDENTIALS.md)

---

## 🔒 Security Reminder

**DO NOT commit `application.properties` with real credentials to Git!**

The file is already in `.gitignore`, but double-check before committing.


