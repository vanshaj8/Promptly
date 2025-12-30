# Quick Database Setup

## Your MySQL Credentials
- Username: `root`
- Password: `Vanshaj@8`
- Database: `Promptly`

## Step 1: Start MySQL (if not running)

**Option A: Using System Preferences**
1. Open System Preferences
2. Click on MySQL
3. Click "Start MySQL Server"

**Option B: Using Command Line**
```bash
sudo /usr/local/mysql-9.5.0-macos15-arm64/support-files/mysql.server start
```

**Option C: Using Launch Agent (if configured)**
```bash
brew services start mysql
# or
sudo launchctl load -w /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist
```

## Step 2: Run Database Setup

**Option 1: Use the automated script (Recommended)**
```bash
cd backend/database
./run_setup.sh
```

**Option 2: Manual setup**
```bash
cd backend/database
mysql -u root -p'Vanshaj@8' < setup.sql
```

**Option 3: Interactive (will prompt for password)**
```bash
cd backend/database
mysql -u root -p < setup.sql
# Enter password when prompted: Vanshaj@8
```

## Step 3: Verify Setup

```bash
mysql -u root -p'Vanshaj@8' Promptly -e "SHOW TABLES;"
mysql -u root -p'Vanshaj@8' Promptly -e "SELECT id, email, role FROM users;"
```

## What Gets Created

- ✅ Database: `Promptly`
- ✅ 6 tables: brands, users, instagram_accounts, comments, replies, admin_activity_logs
- ✅ 1 demo brand
- ✅ 2 default users:
  - Admin: `admin@promptly.com` / `admin123`
  - Brand User: `brand@demo.com` / `admin123`

## Next Steps

1. Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=Vanshaj@8
```

2. Start Spring Boot application:
```bash
cd backend
mvn spring-boot:run
```

## Troubleshooting

**MySQL won't start:**
- Check if MySQL is already running: `ps aux | grep mysql`
- Check MySQL error log: `/usr/local/mysql-9.5.0-macos15-arm64/data/*.err`

**Connection refused:**
- Ensure MySQL server is running
- Check MySQL is listening on port 3306: `lsof -i :3306`

**Access denied:**
- Verify password is correct
- Try: `mysql -u root -p` and enter password interactively

