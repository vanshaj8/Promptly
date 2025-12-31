# Required Credentials Checklist

This document lists all credentials and configuration values needed to run Promptly.

## ✅ Already Configured

### Database
- **Database Name**: `Promptly`
- **Database User**: `root`
- **Database Password**: `Vanshaj@8` (configured)
- **Database Host**: `localhost:3306`

### Server Configuration
- **Backend Port**: `3001`
- **Frontend URL**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3001/api/instagram/callback`

---

## ❌ Required - Must Be Configured

### 1. Facebook App Credentials (Instagram Graph API)

**Where to get them:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (or use existing)
3. Add **Instagram Graph API** product
4. Go to **Settings → Basic**

**Required Values:**
- [ ] **Facebook App ID** (`facebook.app.id`)
  - Location: Facebook App Dashboard → Settings → Basic → App ID
  - Example: `1234567890123456`
  - **Current value**: `your_facebook_app_id` ❌ (needs to be set)

- [ ] **Facebook App Secret** (`facebook.app.secret`)
  - Location: Facebook App Dashboard → Settings → Basic → App Secret (click "Show")
  - Example: `abc123def456ghi789jkl012mno345pq`
  - **Current value**: `your_facebook_app_secret` ❌ (needs to be set)

**Where to configure:**
- File: `backend/src/main/resources/application.properties`
- Lines: 21-22

---

### 2. JWT Secret (Security)

**What it is:**
- Secret key used to sign and verify JWT authentication tokens
- Should be a long, random, secure string

**Required Value:**
- [ ] **JWT Secret** (`jwt.secret`)
  - **Current value**: `your_super_secret_jwt_key_change_in_production` ⚠️ (needs to be changed)
  - **Recommendation**: Generate a secure random string (at least 32 characters)

**How to generate:**
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Where to configure:**
- File: `backend/src/main/resources/application.properties`
- Line: 17

---

### 3. Webhook Credentials (Optional - for real-time updates)

**What they are:**
- Used to verify incoming webhook requests from Instagram
- Only needed if you want real-time comment updates

**Required Values:**
- [ ] **Webhook Verify Token** (`webhook.verify.token`)
  - **Current value**: `your_webhook_verify_token` ❌ (needs to be set)
  - **Recommendation**: A random string you'll use in Facebook App webhook settings
  - Example: `my_secure_webhook_token_12345`

- [ ] **Webhook Secret** (`webhook.secret`)
  - **Current value**: `your_webhook_secret` ❌ (needs to be set)
  - **Recommendation**: A different random string for signature verification
  - Example: `my_webhook_secret_67890`

**Where to configure:**
- File: `backend/src/main/resources/application.properties`
- Lines: 26-27

**Note:** These are optional for MVP. You can use placeholder values if not setting up webhooks yet.

---

## 📋 Quick Configuration Checklist

### Step 1: Facebook App Setup
- [ ] Create Facebook App at [developers.facebook.com](https://developers.facebook.com/)
- [ ] Add **Instagram Graph API** product
- [ ] Get **App ID** and **App Secret**
- [ ] Add redirect URI: `http://localhost:3001/api/instagram/callback` in App Settings
- [ ] Request permissions: `instagram_basic`, `instagram_manage_comments`, `pages_show_list`, `pages_read_engagement`

### Step 2: Update Configuration File
- [ ] Open `backend/src/main/resources/application.properties`
- [ ] Replace `your_facebook_app_id` with your actual App ID
- [ ] Replace `your_facebook_app_secret` with your actual App Secret
- [ ] Generate and replace JWT secret with a secure random string
- [ ] (Optional) Set webhook tokens if using webhooks

### Step 3: Verify Instagram Account
- [ ] Ensure Instagram account is **Business** or **Creator** type
- [ ] Link Instagram account to a **Facebook Page**

---

## 🔧 Configuration File Template

Here's what your `application.properties` should look like after configuration:

```properties
# Server Configuration
server.port=3001

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/Promptly?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Vanshaj@8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=YOUR_GENERATED_JWT_SECRET_HERE
jwt.expiration=604800000

# Instagram/Facebook OAuth Configuration
facebook.app.id=YOUR_FACEBOOK_APP_ID_HERE
facebook.app.secret=YOUR_FACEBOOK_APP_SECRET_HERE
facebook.redirect.uri=http://localhost:3001/api/instagram/callback

# Webhook Configuration (Optional)
webhook.verify.token=YOUR_WEBHOOK_VERIFY_TOKEN_HERE
webhook.secret=YOUR_WEBHOOK_SECRET_HERE

# Frontend URL (for CORS)
frontend.url=http://localhost:3000

# Logging
logging.level.com.promptly=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## 🚨 Security Notes

1. **Never commit secrets to Git**: The `application.properties` file should NOT be committed with real credentials
2. **Use environment variables in production**: For production, use environment variables or a secrets manager
3. **Rotate secrets regularly**: Change JWT secrets and App Secrets periodically
4. **Keep App Secret secure**: Never share your Facebook App Secret publicly

---

## 📚 Additional Resources

- **Instagram Setup Guide**: See [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md)
- **Quick Start**: See [INSTAGRAM_QUICK_START.md](./INSTAGRAM_QUICK_START.md)
- **Facebook Developers**: [developers.facebook.com](https://developers.facebook.com/)

---

## ✅ Verification

After configuration, verify everything works:

1. **Database Connection**: Start backend and check for database connection errors
2. **Facebook App**: Test OAuth flow by clicking "Connect Instagram" in the app
3. **JWT**: Try logging in - should generate valid JWT tokens
4. **Webhooks**: (If configured) Test webhook endpoint receives Instagram events

---

## Summary

**Minimum Required (to get started):**
1. ✅ Database credentials (already set)
2. ❌ Facebook App ID
3. ❌ Facebook App Secret
4. ⚠️ JWT Secret (change from default)

**Optional (for full functionality):**
5. Webhook Verify Token
6. Webhook Secret


