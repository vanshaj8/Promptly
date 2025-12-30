# Database Setup Instructions

## Your MySQL Configuration
- **Username**: root
- **Password**: Vanshaj@8
- **Database**: Promptly
- **Connection**: Already configured in `application.properties`

## Quick Setup Steps

### 1. Ensure MySQL Server is Running

Start MySQL if it's not running:

**Using System Preferences:**
- Open System Preferences → MySQL → Start MySQL Server

**OR using Terminal:**
```bash
sudo /usr/local/mysql-9.5.0-macos15-arm64/support-files/mysql.server start
```

### 2. Run Database Setup

**Easiest way (automated script):**
```bash
cd backend/database
./run_setup.sh
```

**OR manually:**
```bash
cd backend/database
mysql -u root -p'Vanshaj@8' < setup.sql
```

### 3. Verify Setup

```bash
mysql -u root -p'Vanshaj@8' Promptly -e "SHOW TABLES;"
```

You should see:
- brands
- users
- instagram_accounts
- comments
- replies
- admin_activity_logs

### 4. Check Default Users

```bash
mysql -u root -p'Vanshaj@8' Promptly -e "SELECT id, email, role FROM users;"
```

You should see:
- Admin: admin@promptly.com
- Brand User: brand@demo.com

## Ready to Start!

After database setup is complete, you can start the Spring Boot application:

```bash
cd backend
mvn spring-boot:run
```

The application will connect to the `Promptly` database automatically using the credentials in `application.properties`.

## Default Login Credentials

- **Admin**: admin@promptly.com / admin123
- **Brand User**: brand@demo.com / admin123

⚠️ **Change these passwords in production!**

