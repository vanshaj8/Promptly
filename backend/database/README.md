# Database Setup

This directory contains the database schema and seed data for the Promptly application.

## Quick Setup

### Option 1: Using Setup Script (Recommended)

**macOS/Linux:**
```bash
cd backend/database
./setup.sh [mysql_user] [mysql_password]
```

Example:
```bash
./setup.sh root mypassword
# Or if no password:
./setup.sh root
```

**Windows:**
```cmd
cd backend\database
setup.bat [mysql_user] [mysql_password]
```

### Option 2: Manual Setup

1. **Create the database:**
```sql
CREATE DATABASE Promptly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Promptly;
```

2. **Run the schema:**
```bash
mysql -u root -p Promptly < schema.sql
```

3. **Run the seed data:**
```bash
mysql -u root -p Promptly < seed.sql
```

### Option 3: Using MySQL Command Line

```bash
mysql -u root -p <<EOF
CREATE DATABASE IF NOT EXISTS Promptly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Promptly;
SOURCE schema.sql;
SOURCE seed.sql;
EOF
```

## Important Notes

1. **Database Name**: The database name is case-sensitive: `Promptly` (capital P)
2. **Default Users**: 
   - Admin: `admin@promptly.com` / `admin123`
   - Brand User: `brand@demo.com` / `admin123`
   - ⚠️ **Change these passwords in production!**

3. **Password Hash**: The seed file uses bcrypt hashes. To generate new hashes:
   - Using Spring Boot: The `AuthService` uses BCryptPasswordEncoder
   - The hash in seed.sql is for password "admin123"

## Verifying Setup

After setup, verify the database:

```sql
USE Promptly;

-- Check tables
SHOW TABLES;

-- Check brands
SELECT * FROM brands;

-- Check users
SELECT id, email, role, brand_id FROM users;

-- Verify admin user
SELECT * FROM users WHERE email = 'admin@promptly.com';
```

## Troubleshooting

**Error: Access denied**
- Check MySQL credentials
- Ensure MySQL is running
- Try: `mysql -u root -p` to test connection

**Error: Database already exists**
- The script uses `CREATE DATABASE IF NOT EXISTS`, so it's safe to run multiple times
- To start fresh: `DROP DATABASE Promptly;` then run setup again

**Error: Foreign key constraint fails**
- Make sure to run schema.sql before seed.sql
- Tables are created in dependency order in schema.sql

## Schema Overview

- `brands` - Tenant/brand information
- `users` - Admin and brand users
- `instagram_accounts` - Connected Instagram accounts
- `comments` - Instagram comments
- `replies` - Replies to comments
- `admin_activity_logs` - Admin activity tracking

