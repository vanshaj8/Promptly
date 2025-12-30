# Database Setup Instructions

## Prerequisites
- MySQL server installed and running
- MySQL root access

## Setup Steps

### 1. Create Database and Tables

Run the setup script:

```bash
cd backend/database
mysql -u root -p Promptly < setup.sql
```

Or manually:

```bash
mysql -u root -p
```

Then execute:

```sql
CREATE DATABASE IF NOT EXISTS Promptly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Promptly;
source backend/database/setup.sql;
```

### 2. Verify Setup

Check that all tables were created:

```sql
SHOW TABLES;
```

You should see:
- brands
- users
- instagram_accounts
- comments
- replies
- admin_activity_logs

### 3. Default Credentials

The setup script creates default users:

**Admin User:**
- Email: `admin@promptly.com`
- Password: `admin123`

**Brand User:**
- Email: `brand@demo.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these passwords in production!

### 4. Database Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Promptly?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Vanshaj@8
```

## Schema Updates

The schema includes:
- Multi-tenant isolation via `brand_id` in all business tables
- Support for comment statuses: OPEN, REPLIED, HIDDEN
- JSON field for admin activity logs
- Proper indexes for performance

## Troubleshooting

### Connection Issues
- Ensure MySQL is running: `mysqladmin -u root -p status`
- Check MySQL socket location if using Unix socket
- Verify password is correct

### Permission Issues
- Ensure user has CREATE DATABASE and CREATE TABLE permissions
- Check MySQL user grants: `SHOW GRANTS FOR 'root'@'localhost';`

