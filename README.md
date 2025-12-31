# Promptly - Replies, right on time

**Promptly** is a SaaS platform that helps brands manage and respond to Instagram comments and mentions from a unified dashboard. Connect your Instagram Business account and handle all customer interactions in one place.

> **Replies, right on time** - Never miss a customer interaction with Promptly's unified Instagram engagement platform.

## What Promptly Does

Promptly centralizes your Instagram engagement workflow, making it easy to:
- **View all comments** from your Instagram posts in a single inbox
- **Respond to customers** directly from the dashboard without switching apps
- **Track mentions** and engagement across your Instagram account
- **Manage multiple brands** from one platform (for agencies and multi-brand companies)
- **Monitor activity** with detailed logs and analytics

## Key Features

### 📥 Unified Inbox
See all Instagram comments and mentions in one organized view. No more switching between Instagram app and browser tabs.

### 💬 Direct Replies
Respond to comments instantly from your dashboard. Your replies are posted directly to Instagram in real-time.

### 🔗 Instagram Integration
Connect your Instagram Business account securely through Facebook OAuth. Your account stays connected for seamless access.

### 👥 Multi-Brand Support
Perfect for agencies and companies managing multiple brands. Each brand has isolated data and dedicated users.

### 🔐 Role-Based Access
- **Brand Users**: Access only their assigned brand's comments and data
- **Admin Users**: Manage all brands, view activity logs, and configure settings

### ⚡ Real-Time Updates
Receive instant notifications when new comments arrive via webhook integration with Instagram.

### 📊 Activity Tracking
Monitor all actions with detailed activity logs. See who replied, when, and track engagement patterns.

## How It Works

1. **Connect Your Instagram Account**: Link your Instagram Business account through a secure Facebook OAuth flow
2. **View Your Inbox**: All comments from your Instagram posts appear in your dashboard inbox
3. **Respond Instantly**: Click on any comment to reply directly from the platform
4. **Stay Organized**: Filter, search, and manage comments with status tracking (pending, replied, archived)
5. **Monitor Activity**: Track all engagement and responses through detailed activity logs

## Use Cases

- **E-commerce Brands**: Respond to customer questions and feedback on product posts
- **Service Businesses**: Engage with potential clients commenting on your services
- **Content Creators**: Manage community engagement and build relationships
- **Marketing Agencies**: Handle multiple client Instagram accounts from one dashboard
- **Multi-Brand Companies**: Centralize Instagram management across different brand accounts

## Getting Started

### For End Users

1. **Sign Up or Log In**: Create an account or log in with your credentials
2. **Connect Instagram**: Link your Instagram Business account through the secure connection flow
3. **Start Managing**: Your comments will appear in the inbox automatically
4. **Respond**: Click on any comment to reply directly to your customers

### For Administrators

- **Manage Brands**: Create and configure brand accounts
- **Assign Users**: Add team members to specific brands
- **View Activity**: Monitor all platform activity through detailed logs
- **Configure Settings**: Set up webhooks and integration preferences

## Dashboard Features

### Inbox View
- See all comments from your Instagram posts
- Filter by status (pending, replied, archived)
- Search comments by keyword
- View comment details including post context
- See reply history for each comment

### Instagram Account Management
- Connect/disconnect Instagram Business accounts
- View connected account information
- Sync comments manually if needed
- Monitor connection status

### Admin Panel
- Create and manage brand accounts
- Assign users to brands
- View comprehensive activity logs
- Enable/disable brand accounts
- Categorize and organize brands

## Security & Privacy

- **Secure Authentication**: JWT-based authentication with encrypted tokens
- **Data Isolation**: Each brand's data is completely isolated from others
- **Role-Based Access**: Users can only access data they're authorized to see
- **Secure Connections**: All Instagram connections use OAuth 2.0
- **Encrypted Storage**: Passwords and sensitive data are securely hashed
- **Webhook Verification**: All incoming webhooks are verified for authenticity

## Platform Capabilities

### Current Features
- ✅ Instagram Business account integration
- ✅ Comment management and replies
- ✅ Multi-brand support
- ✅ Real-time webhook updates
- ✅ Activity logging
- ✅ Role-based access control

### Platform Limitations (MVP)
- Instagram only (no other social platforms)
- Business accounts only (personal accounts not supported)
- Manual replies only (no AI-powered responses)
- No automated actions or scheduling

---

## Technical Setup

*This section is for developers setting up the platform locally.*

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (with schema named "Promptly")
- Node.js 18+ and npm
- Facebook App with Instagram Graph API access

### Installation

1. **Clone and Install Dependencies**
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies (Maven will download automatically)
cd ../backend
mvn clean install
```

2. **Database Setup**
```sql
CREATE DATABASE promptly_db;
```

3. **Environment Configuration**
```bash
# Backend
# Update backend/src/main/resources/application.properties with:
# - Database credentials
# - Facebook App ID and Secret (see Instagram setup below)
# - JWT secret
# - Webhook tokens

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Update frontend/.env.local with API URL
```

4. **Instagram Graph API Setup**
   - See [INSTAGRAM_SETUP.md](./INSTAGRAM_SETUP.md) for detailed instructions
   - Quick start: [INSTAGRAM_QUICK_START.md](./INSTAGRAM_QUICK_START.md)
   - Configure Facebook App ID, Secret, and redirect URI in `application.properties`

5. **Run Migrations**
```bash
cd backend
npm run migrate
```

6. **Start Services**
```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Tech Stack

**Backend**: Spring Boot 3.2 (Java 17), MySQL, JWT Authentication, Instagram Graph API  
**Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS

### API Endpoints

See [QUICKSTART.md](./QUICKSTART.md) for detailed API documentation.

### Project Structure

```
promptly/
├── backend/          # Spring Boot backend
├── frontend/         # Next.js frontend
└── README.md
```

## License

ISC

