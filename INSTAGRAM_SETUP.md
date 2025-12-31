# Instagram Graph API Authentication Setup Guide

This guide will walk you through setting up Instagram Graph API authentication for Promptly.

## Prerequisites

1. A Facebook Business account
2. An Instagram Business account (must be linked to a Facebook Page)
3. Access to [Facebook Developers](https://developers.facebook.com/)

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as the app type
4. Fill in:
   - **App Name**: Promptly (or your preferred name)
   - **App Contact Email**: Your email address
   - **Business Account**: Select or create one
5. Click **"Create App"**

## Step 2: Add Instagram Products

1. In your app dashboard, go to **"Add Products"** or **"Products"** in the left sidebar
2. Find **"Instagram"** and click **"Set Up"**
3. You'll see two options:
   - **Instagram Basic Display** (for personal accounts)
   - **Instagram Graph API** (for Business accounts) ← **Select this one**

## Step 3: Configure OAuth Settings

1. In the left sidebar, go to **"Settings"** → **"Basic"**
2. Note down your **App ID** and **App Secret** (you'll need these later)
3. Click **"Add Platform"** and select **"Website"**
4. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - For production, use your actual domain

## Step 4: Configure OAuth Redirect URIs

1. In the left sidebar, go to **"Products"** → **"Instagram"** → **"Basic Display"** or **"Instagram Graph API"**
2. Scroll to **"Valid OAuth Redirect URIs"**
3. Add your callback URL:
   ```
   http://localhost:3001/api/instagram/callback
   ```
   For production:
   ```
   https://yourdomain.com/api/instagram/callback
   ```

## Step 5: Request Required Permissions

1. Go to **"Products"** → **"Instagram"** → **"Instagram Graph API"**
2. Navigate to **"Permissions and Features"** or **"App Review"**
3. Request the following permissions:
   - `instagram_basic` - Read basic Instagram account information
   - `instagram_manage_comments` - Manage comments on Instagram posts
   - `pages_show_list` - Access list of Facebook Pages
   - `pages_read_engagement` - Read engagement data from Pages

### For Development/Testing:
- You can add yourself as a **Test User** or **Admin** to test without app review
- Go to **"Roles"** → **"Roles"** → Add yourself as **"Administrator"** or **"Developer"**

### For Production:
- Submit your app for review with these permissions
- Provide use case descriptions for each permission
- Facebook will review and approve your app

## Step 6: Link Instagram Business Account to Facebook Page

1. Your Instagram account must be a **Business** or **Creator** account
2. Go to your Instagram account settings → **"Account"** → **"Switch to Professional Account"** (if not already)
3. Link your Instagram account to a Facebook Page:
   - Instagram Settings → **"Account"** → **"Linked Accounts"** → **"Facebook"**
   - Select or create a Facebook Page to link

## Step 7: Configure Your Application

### Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
# Instagram/Facebook OAuth Configuration
facebook.app.id=YOUR_FACEBOOK_APP_ID
facebook.app.secret=YOUR_FACEBOOK_APP_SECRET
facebook.redirect.uri=http://localhost:3001/api/instagram/callback

# Frontend URL (for CORS and redirects)
frontend.url=http://localhost:3000
```

### For Production:

```properties
facebook.app.id=YOUR_FACEBOOK_APP_ID
facebook.app.secret=YOUR_FACEBOOK_APP_SECRET
facebook.redirect.uri=https://yourdomain.com/api/instagram/callback
frontend.url=https://yourdomain.com
```

## Step 8: Test the Connection

1. Start your backend server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Log in to your application
4. Navigate to the Instagram connection page
5. Click **"Connect Instagram"**
6. You'll be redirected to Facebook OAuth
7. Authorize the app with the requested permissions
8. You'll be redirected back to your application
9. Your Instagram account should now be connected!

## Troubleshooting

### Error: "No Instagram account found"
- Ensure your Instagram account is a **Business** or **Creator** account
- Verify the Instagram account is linked to a Facebook Page
- Check that you've granted `pages_show_list` permission

### Error: "Invalid redirect_uri"
- Verify the redirect URI in your app settings matches exactly
- Check for trailing slashes or protocol mismatches (http vs https)
- Ensure the URI is added to "Valid OAuth Redirect URIs"

### Error: "Invalid OAuth access token"
- Check that your App ID and App Secret are correct
- Verify the access token hasn't expired
- Ensure you've requested the correct permissions

### Error: "App not in development mode"
- For production, ensure your app is approved and live
- For development, add test users in App Settings → Roles

## Required Permissions Explained

- **`instagram_basic`**: Allows reading basic profile information (username, profile picture)
- **`instagram_manage_comments`**: Allows reading and replying to comments on Instagram posts
- **`pages_show_list`**: Allows listing Facebook Pages the user manages
- **`pages_read_engagement`**: Allows reading engagement metrics from Pages

## Security Best Practices

1. **Never commit secrets**: Keep `application.properties` with secrets out of version control
2. **Use environment variables**: For production, use environment variables or a secrets manager
3. **Rotate secrets**: Regularly rotate your App Secret
4. **Limit permissions**: Only request permissions you actually need
5. **Use HTTPS**: Always use HTTPS in production for OAuth callbacks

## Next Steps

After successful authentication:
- Comments will sync automatically via webhooks (if configured)
- You can manually sync comments using the sync endpoint
- Replies can be sent directly from the dashboard

## Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook OAuth Documentation](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow)
- [Instagram Business Account Setup](https://help.instagram.com/502981923235522)

