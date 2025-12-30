# Database Connectivity Check Guide

## Configuration Summary

### Current Database Configuration

**File:** `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Promptly?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Vanshaj@8
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Connection Details
- **Host:** localhost
- **Port:** 3306
- **Database:** Promptly (case-sensitive)
- **Username:** root
- **Password:** Vanshaj@8
- **Driver:** MySQL Connector/J (version 8.1.0)

## Automatic Connectivity Test

A `DatabaseConfig` class has been created that automatically tests the database connection when the Spring Boot application starts. It will:

1. ✅ Test basic database connection
2. ✅ Verify database name
3. ✅ Count total tables
4. ✅ Check for all required tables:
   - brands
   - users
   - instagram_accounts
   - comments
   - replies
   - admin_activity_logs

## How to Test Connectivity

### Option 1: Run the Application (Recommended)

```bash
cd backend
mvn spring-boot:run
```

Look for these log messages in the console:
```
Testing database connection...
✓ Database connection successful!
✓ Connected to database: Promptly
✓ Found 6 tables in database
✓ Table 'brands' exists
✓ Table 'users' exists
...
Database connectivity check completed!
```

### Option 2: Compile and Check for Errors

```bash
cd backend
mvn clean compile
```

If there are connection errors, they will appear during compilation or when trying to initialize JPA entities.

### Option 3: Manual Database Test

You can also test the connection manually using MySQL:

```bash
mysql -u root -pVanshaj@8 -e "USE Promptly; SELECT 'Connection successful!' AS Status;"
```

## Common Connection Issues

### Issue 1: "Access denied for user"

**Symptoms:**
```
Access denied for user 'root'@'localhost' (using password: YES)
```

**Solutions:**
- Verify the password in `application.properties` is correct
- Check if MySQL user has proper permissions
- Try connecting manually: `mysql -u root -p`

### Issue 2: "Unknown database 'Promptly'"

**Symptoms:**
```
Unknown database 'Promptly'
```

**Solutions:**
- Run the database setup script: `backend/database/promptly_setup.sql`
- Verify database name is exactly "Promptly" (case-sensitive)
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue 3: "Communications link failure"

**Symptoms:**
```
Communications link failure
```

**Solutions:**
- Verify MySQL server is running: `mysqladmin -u root -p status`
- Check MySQL is listening on port 3306
- Verify firewall settings allow localhost connections
- On macOS, check if MySQL is running: `brew services list` (if installed via Homebrew)

### Issue 4: "Table doesn't exist"

**Symptoms:**
```
Table 'Promptly.brands' doesn't exist
```

**Solutions:**
- Run the setup script: `backend/database/promptly_setup.sql`
- Verify all tables were created: `mysql -u root -p Promptly -e "SHOW TABLES;"`

### Issue 5: "Connection timeout"

**Symptoms:**
```
Connection timed out
```

**Solutions:**
- Check MySQL server is running
- Verify connection string URL is correct
- Check network connectivity to localhost:3306

## Verification Steps

1. **Check MySQL is Running:**
   ```bash
   mysqladmin -u root -p status
   ```

2. **Verify Database Exists:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES LIKE 'Promptly';"
   ```

3. **Check Tables Exist:**
   ```bash
   mysql -u root -p Promptly -e "SHOW TABLES;"
   ```

4. **Test Connection from Java:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **Check Application Logs:**
   Look for database connection messages in the console output.

## Troubleshooting Commands

### Check MySQL Connection String
```bash
mysql -u root -pVanshaj@8 -h localhost -P 3306 Promptly -e "SELECT 'Connection OK' AS Status;"
```

### Verify Database Schema
```bash
mysql -u root -pVanshaj@8 Promptly -e "SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = 'Promptly';"
```

### Test Specific Table Access
```bash
mysql -u root -pVanshaj@8 Promptly -e "SELECT COUNT(*) FROM users;"
```

## Next Steps

Once connectivity is confirmed:

1. ✅ Database connection successful
2. ✅ All tables exist
3. ✅ Application can start
4. ✅ API endpoints are accessible

If all checks pass, your backend is ready to use!

