-- =====================================================
-- Database Verification Script
-- Run this in MySQL Workbench to verify your database setup
-- =====================================================

USE Promptly;

-- =====================================================
-- 1. Check if database exists
-- =====================================================
SELECT 'Database Check' AS Test;
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'Promptly';

-- =====================================================
-- 2. List all tables (should have 6 tables)
-- =====================================================
SELECT 'Tables Check' AS Test;
SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'Promptly' 
ORDER BY TABLE_NAME;

SELECT 'Expected: 6 tables (brands, users, instagram_accounts, comments, replies, admin_activity_logs)' AS Expected;

-- =====================================================
-- 3. Verify Brands table structure
-- =====================================================
SELECT 'Brands Table Structure' AS Test;
DESCRIBE brands;

-- Check if default brand exists
SELECT 'Brands Data Check' AS Test;
SELECT id, name, category, is_active, created_at FROM brands;

-- =====================================================
-- 4. Verify Users table structure
-- =====================================================
SELECT 'Users Table Structure' AS Test;
DESCRIBE users;

-- Check if default users exist
SELECT 'Users Data Check' AS Test;
SELECT id, email, role, brand_id, full_name, created_at FROM users ORDER BY id;

-- Expected: 2 users (1 ADMIN, 1 BRAND_USER)
SELECT 'Expected: 2 users (admin@promptly.com with role ADMIN, brand@demo.com with role BRAND_USER)' AS Expected;

-- =====================================================
-- 5. Verify Comments table structure and HIDDEN status
-- =====================================================
SELECT 'Comments Table Structure' AS Test;
DESCRIBE comments;

-- Check if status column supports HIDDEN
SELECT 'Comments Status ENUM Check' AS Test;
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'Promptly' 
  AND TABLE_NAME = 'comments' 
  AND COLUMN_NAME = 'status';

-- Expected: status should be ENUM('OPEN','REPLIED','HIDDEN')
SELECT 'Expected: status column should be ENUM with OPEN, REPLIED, HIDDEN values' AS Expected;

-- =====================================================
-- 6. Verify Instagram Accounts table structure
-- =====================================================
SELECT 'Instagram Accounts Table Structure' AS Test;
DESCRIBE instagram_accounts;

-- =====================================================
-- 7. Verify Replies table structure
-- =====================================================
SELECT 'Replies Table Structure' AS Test;
DESCRIBE replies;

-- =====================================================
-- 8. Verify Admin Activity Logs table structure
-- =====================================================
SELECT 'Admin Activity Logs Table Structure' AS Test;
DESCRIBE admin_activity_logs;

-- Check if details column is JSON type
SELECT 'Admin Activity Logs JSON Column Check' AS Test;
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'Promptly' 
  AND TABLE_NAME = 'admin_activity_logs' 
  AND COLUMN_NAME = 'details';

SELECT 'Expected: details column should be JSON type' AS Expected;

-- =====================================================
-- 9. Verify Foreign Key Constraints
-- =====================================================
SELECT 'Foreign Key Constraints Check' AS Test;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'Promptly'
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- Expected Foreign Keys:
-- users.brand_id -> brands.id
-- instagram_accounts.brand_id -> brands.id
-- comments.brand_id -> brands.id
-- comments.instagram_account_id -> instagram_accounts.id
-- replies.comment_id -> comments.id
-- replies.brand_id -> brands.id
-- replies.user_id -> users.id
-- admin_activity_logs.admin_user_id -> users.id

-- =====================================================
-- 10. Verify Indexes
-- =====================================================
SELECT 'Indexes Check' AS Test;
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'Promptly'
  AND INDEX_NAME != 'PRIMARY'
GROUP BY TABLE_NAME, INDEX_NAME
ORDER BY TABLE_NAME, INDEX_NAME;

-- =====================================================
-- 11. Summary Report
-- =====================================================
SELECT '=== SUMMARY REPORT ===' AS Report;

SELECT 
    'Total Tables' AS Metric,
    COUNT(*) AS Value
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'Promptly';

SELECT 
    'Total Users' AS Metric,
    COUNT(*) AS Value
FROM users;

SELECT 
    'Total Brands' AS Metric,
    COUNT(*) AS Value
FROM brands;

SELECT 
    'Admin Users' AS Metric,
    COUNT(*) AS Value
FROM users WHERE role = 'ADMIN';

SELECT 
    'Brand Users' AS Metric,
    COUNT(*) AS Value
FROM users WHERE role = 'BRAND_USER';

SELECT 
    'Foreign Keys' AS Metric,
    COUNT(DISTINCT CONSTRAINT_NAME) AS Value
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'Promptly'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- =====================================================
-- 12. Validation Checks
-- =====================================================
SELECT '=== VALIDATION CHECKS ===' AS Validation;

-- Check if all required tables exist
SELECT 
    CASE 
        WHEN COUNT(*) = 6 THEN 'PASS'
        ELSE CONCAT('FAIL: Found ', COUNT(*), ' tables, expected 6')
    END AS 'All Tables Present'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'Promptly';

-- Check if default users exist
SELECT 
    CASE 
        WHEN COUNT(*) = 2 THEN 'PASS'
        ELSE CONCAT('FAIL: Found ', COUNT(*), ' users, expected 2')
    END AS 'Default Users Present'
FROM users;

-- Check if HIDDEN status is in comments table
SELECT 
    CASE 
        WHEN COLUMN_TYPE LIKE '%HIDDEN%' THEN 'PASS'
        ELSE CONCAT('FAIL: HIDDEN status not found in comments.status. Current type: ', COLUMN_TYPE)
    END AS 'HIDDEN Status in Comments'
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'Promptly'
  AND TABLE_NAME = 'comments'
  AND COLUMN_NAME = 'status';

-- Check if JSON column exists in admin_activity_logs
SELECT 
    CASE 
        WHEN COLUMN_TYPE LIKE '%json%' OR COLUMN_TYPE LIKE '%JSON%' THEN 'PASS'
        ELSE CONCAT('FAIL: details column is not JSON type. Current type: ', COLUMN_TYPE)
    END AS 'JSON Column in Admin Logs'
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'Promptly'
  AND TABLE_NAME = 'admin_activity_logs'
  AND COLUMN_NAME = 'details';

-- =====================================================
-- Verification Complete!
-- =====================================================
SELECT '=== VERIFICATION COMPLETE ===' AS Status;
SELECT 'Review the results above to ensure all checks pass.' AS Note;

