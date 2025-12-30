# Database Setup Instructions

## Quick Setup (Recommended)

Run this single command (it will prompt for your MySQL password):

```bash
cd backend/database
mysql -u root -p < setup.sql
```

## Alternative Methods

### Method 1: Using MySQL Command Line (Interactive)

```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
source /full/path/to/Promptly/backend/database/setup.sql
```

Or paste the contents of `setup.sql` directly.

### Method 2: Step by Step

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS Promptly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Run schema
mysql -u root -p Promptly < schema.sql

# 3. Run seed data
mysql -u root -p Promptly < seed.sql
```

### Method 3: Using Setup Script

**macOS/Linux:**
```bash
cd backend/database
./setup.sh root your_password
```

**Windows:**
```cmd
cd backend\database
setup.bat root your_password
```

## Verify Setup

After setup, verify everything worked:

```bash
mysql -u root -p Promptly -e "SHOW TABLES;"
mysql -u root -p Promptly -e "SELECT id, email, role FROM users;"
```

Or interactively:
```bash
mysql -u root -p Promptly
```

Then:
```sql
SHOW TABLES;
SELECT * FROM brands;
SELECT id, email, role, brand_id FROM users;
```

## Default Credentials

After setup, you can login with:

- **Admin**: `admin@promptly.com` / `admin123`
- **Brand User**: `brand@demo.com` / `admin123`

⚠️ **IMPORTANT**: Change these passwords in production!

## Troubleshooting

**Problem**: Access denied
- Make sure MySQL is running: `mysql.server start` (macOS) or check MySQL service
- Verify your root password
- Try: `mysql -u root -p` to test connection

**Problem**: Database already exists
- Safe to run multiple times (uses `IF NOT EXISTS`)
- To start fresh: `DROP DATABASE Promptly;` then run setup again

**Problem**: Foreign key constraint fails
- Make sure you're using `setup.sql` which creates tables in correct order
- Or run `schema.sql` before `seed.sql`

## Database Connection for Spring Boot

After setup, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Promptly?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

The database name is case-sensitive: `Promptly` (capital P)

