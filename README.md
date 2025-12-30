# Promptly - Instagram Brand Engagement Tool

A multi-tenant SaaS web application that helps brands manage Instagram comments and mentions from a single dashboard.

## Features

- **Multi-tenant Architecture**: Brand-based data isolation
- **User Roles**: Admin and Brand User with role-based access control
- **Instagram Integration**: Connect Instagram Business accounts via Facebook OAuth
- **Unified Inbox**: View and manage all comments and mentions in one place
- **Manual Replies**: Reply to comments directly from the dashboard
- **Admin Dashboard**: Manage brands, categorize them, and monitor activity
- **Webhook Support**: Real-time comment updates via Instagram webhooks

## Tech Stack

### Backend
- Spring Boot 3.2 (Java 17)
- MySQL database (schema: Promptly)
- JWT authentication
- Instagram Graph API integration

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (with schema named "Promptly")
- Facebook App with Instagram Graph API access

### 1. Clone and Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies (Maven will download automatically)
cd ../backend
mvn clean install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE promptly_db;
```

2. Copy environment file:
```bash
cp backend/.env.example backend/.env
```

3. Update `backend/.env` with your database credentials and other settings:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=promptly_db

JWT_SECRET=your_super_secret_jwt_key
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3001/api/auth/instagram/callback
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

4. Generate password hash for seed data (optional, for default users):
```bash
cd backend
node scripts/generate-password.js admin123
# Copy the generated hash and update database/seed.sql if needed
```

5. Run migrations:
```bash
cd backend
npm run migrate
```

### 3. Facebook/Instagram App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app and add Instagram Basic Display and Instagram Graph API products
3. Add OAuth redirect URI: `http://localhost:3001/api/auth/instagram/callback`
4. Set up webhook subscription for Instagram comments
5. Get your App ID and App Secret
6. Add required permissions:
   - `instagram_basic`
   - `instagram_manage_comments`
   - `pages_show_list`
   - `pages_read_engagement`

### 4. Frontend Setup

1. Copy environment file:
```bash
cp frontend/.env.local.example frontend/.env.local
```

2. Update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Run the Application

```bash
# Terminal 1: Start Spring Boot backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Next.js frontend
cd frontend
npm run dev
```

Backend will run on `http://localhost:3001`  
Frontend will run on `http://localhost:3000`

## Default Credentials

After running migrations, you can use these test credentials (change in production!):

- **Admin**: `admin@promptly.com` / `admin123`
- **Brand User**: `brand@demo.com` / `admin123`

⚠️ **Important**: Change these passwords in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Comments
- `GET /api/comments` - Get all comments (filtered by brand)
- `GET /api/comments/:id` - Get single comment with replies
- `POST /api/comments/:id/reply` - Reply to a comment
- `POST /api/comments/sync` - Manually sync comments

### Instagram
- `GET /api/instagram/connect-url` - Get OAuth URL
- `GET /api/instagram/callback` - OAuth callback handler
- `GET /api/instagram/account` - Get connected account
- `POST /api/instagram/disconnect` - Disconnect account

### Admin
- `GET /api/admin/brands` - Get all brands
- `GET /api/admin/brands/:id` - Get brand details
- `POST /api/admin/brands` - Create brand
- `PUT /api/admin/brands/:id` - Update brand
- `PATCH /api/admin/brands/:id/status` - Enable/disable brand
- `GET /api/admin/logs` - Get activity logs

### Webhooks
- `GET /api/webhooks` - Webhook verification
- `POST /api/webhooks` - Webhook event handler

## Project Structure

```
promptly/
├── backend/
│   ├── src/main/java/com/promptly/
│   │   ├── controller/        # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # JPA repositories
│   │   ├── entity/            # JPA entities
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── config/            # Configuration
│   │   └── security/         # Security components
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   └── pom.xml
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   │   └── api.ts
│   └── package.json
└── README.md
```

## MVP Constraints

- Instagram only (no other platforms)
- Business accounts only
- Manual replies only (no AI)
- No automation
- Meta-compliant and approval-friendly

## Security Notes

- All API endpoints are protected with JWT authentication
- Brand users can only access their own brand's data
- Admin users have access to all brands
- Passwords are hashed using bcrypt
- Webhook signatures are verified (when secret is provided)

## Development

### Database Migrations

To reset the database:
```bash
cd backend
npm run migrate
```

### Adding New Features

1. Backend: Add routes in `backend/routes/`
2. Frontend: Add pages in `frontend/app/` or components in `frontend/components/`
3. API client: Update `frontend/lib/api.ts` with new endpoints

## License

ISC

