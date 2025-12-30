#!/bin/bash

# Database setup script for Promptly
# Usage: ./setup.sh [mysql_user] [mysql_password]

DB_USER=${1:-root}
DB_PASSWORD=${2:-}
DB_NAME="Promptly"

echo "Setting up Promptly database..."

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "Error: MySQL client not found. Please install MySQL first."
    exit 1
fi

# Create database
echo "Creating database: $DB_NAME"
if [ -z "$DB_PASSWORD" ]; then
    mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
else
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
fi

if [ $? -ne 0 ]; then
    echo "Error: Failed to create database. Please check your MySQL credentials."
    exit 1
fi

# Run schema
echo "Running schema.sql..."
if [ -z "$DB_PASSWORD" ]; then
    mysql -u "$DB_USER" "$DB_NAME" < schema.sql
else
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < schema.sql
fi

if [ $? -ne 0 ]; then
    echo "Error: Failed to run schema.sql"
    exit 1
fi

# Run seed data
echo "Running seed.sql..."
if [ -z "$DB_PASSWORD" ]; then
    mysql -u "$DB_USER" "$DB_NAME" < seed.sql
else
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < seed.sql
fi

if [ $? -ne 0 ]; then
    echo "Error: Failed to run seed.sql"
    exit 1
fi

echo "✅ Database setup completed successfully!"
echo ""
echo "Database: $DB_NAME"
echo "Default users created:"
echo "  Admin: admin@promptly.com / admin123"
echo "  Brand User: brand@demo.com / admin123"
echo ""
echo "⚠️  IMPORTANT: Change these passwords in production!"

