# Instagram Graph API - Quick Start

## Quick Configuration Checklist

### 1. Facebook App Setup (5 minutes)
- [ ] Create app at [developers.facebook.com](https://developers.facebook.com/)
- [ ] Add **Instagram Graph API** product
- [ ] Get **App ID** and **App Secret**
- [ ] Add redirect URI: `http://localhost:3001/api/instagram/callback`

### 2. Instagram Account Setup
- [ ] Convert Instagram to **Business** or **Creator** account
- [ ] Link Instagram to a **Facebook Page**

### 3. Application Configuration
Update `backend/src/main/resources/application.properties`:

```properties
facebook.app.id=YOUR_APP_ID_HERE
facebook.app.secret=YOUR_APP_SECRET_HERE
facebook.redirect.uri=http://localhost:3001/api/instagram/callback
frontend.url=http://localhost:3000
```

### 4. Required Permissions
Request these permissions in Facebook App:
- `instagram_basic`
- `instagram_manage_comments`
- `pages_show_list`
- `pages_read_engagement`

### 5. Test Connection
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Log in and navigate to Instagram page
4. Click "Connect Instagram"
5. Authorize the app

## Common Issues

| Issue | Solution |
|-------|----------|
| "No Instagram account found" | Ensure Instagram is Business/Creator and linked to Facebook Page |
| "Invalid redirect_uri" | Check URI matches exactly in Facebook App settings |
| "App not in development mode" | Add test users in App Settings → Roles |

## Full Documentation
See [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md) for detailed instructions.

