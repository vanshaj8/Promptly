# Database Verification Guide

## Quick Verification Steps

### Option 1: Using MySQL Workbench (Recommended)

1. **Open MySQL Workbench** and connect to your MySQL server
2. **Open the verification script**:
   - File → Open SQL Script
   - Navigate to: `backend/database/verify_database.sql`
3. **Execute the script**:
   - Click the Execute button (⚡) or press `Ctrl+Shift+Enter`
4. **Review the results**:
   - Check that all validation checks show "PASS"
   - Verify that all 6 tables are present
   - Confirm that default users and brand are created

### Option 2: Using MySQL Command Line

```bash
cd backend/database
mysql -u root -p Promptly < verify_database.sql
```

## Expected Results

### ✅ Database Should Contain:

1. **6 Tables:**
   - `brands`
   - `users`
   - `instagram_accounts`
   - `comments`
   - `replies`
   - `admin_activity_logs`

2. **Default Data:**
   - 1 brand: "Demo Brand" (id: 1, category: "Retail")
   - 2 users:
     - Admin: `admin@promptly.com` (role: ADMIN, brand_id: NULL)
     - Brand User: `brand@demo.com` (role: BRAND_USER, brand_id: 1)

3. **Key Validations:**
   - ✅ Comments table has `status` column with ENUM('OPEN','REPLIED','HIDDEN')
   - ✅ Admin activity logs table has `details` column as JSON type
   - ✅ All foreign key constraints are properly set up
   - ✅ Indexes are created for performance

## Manual Verification Queries

If you prefer to run individual queries, here are the key checks:

### Check Tables
```sql
USE Promptly;
SHOW TABLES;
```

### Check Comments Status ENUM
```sql
DESCRIBE comments;
-- Look for: status | enum('OPEN','REPLIED','HIDDEN')
```

### Check Default Users
```sql
SELECT id, email, role, brand_id FROM users;
```

### Check Default Brand
```sql
SELECT id, name, category, is_active FROM brands;
```

### Check Foreign Keys
```sql
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'Promptly'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Troubleshooting

### If verification fails:

1. **Database doesn't exist:**
   - Run `promptly_setup.sql` to create the database

2. **Tables are missing:**
   - Check if the CREATE TABLE statements executed successfully
   - Look for error messages in MySQL Workbench output

3. **HIDDEN status missing:**
   - The comments table might need to be altered:
   ```sql
   ALTER TABLE comments MODIFY COLUMN status ENUM('OPEN','REPLIED','HIDDEN') DEFAULT 'OPEN';
   ```

4. **Default users missing:**
   - Run the INSERT statements from `promptly_setup.sql` again
   - Check for duplicate key errors (users might already exist)

5. **Foreign keys not working:**
   - Verify that referenced tables exist
   - Check if tables are using InnoDB engine (required for foreign keys)

## Contact & Support

If you encounter issues:
1. Check MySQL error logs
2. Verify MySQL version (should be 5.7+ or 8.0+)
3. Ensure you have proper permissions to create databases and tables

