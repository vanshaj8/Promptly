#!/bin/bash

# Database setup script with password
# Run this after ensuring MySQL is running

DB_USER="root"
DB_PASSWORD="Vanshaj@8"
DB_NAME="Promptly"

echo "Setting up Promptly database..."
echo ""

# Use the full MySQL path
MYSQL_PATH="/usr/local/mysql-9.5.0-macos15-arm64/bin/mysql"

if [ ! -f "$MYSQL_PATH" ]; then
    echo "Error: MySQL client not found at $MYSQL_PATH"
    echo "Trying system mysql..."
    MYSQL_PATH="mysql"
fi

# Create database and run setup
"$MYSQL_PATH" -u "$DB_USER" -p"$DB_PASSWORD" < setup.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Verifying setup..."
    "$MYSQL_PATH" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;"
    echo ""
    echo "Default users created:"
    "$MYSQL_PATH" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT id, email, role, brand_id FROM users;"
    echo ""
    echo "⚠️  IMPORTANT: Change default passwords in production!"
else
    echo ""
    echo "❌ Database setup failed."
    echo ""
    echo "Please ensure:"
    echo "1. MySQL server is running"
    echo "2. Password is correct"
    echo "3. MySQL is accessible"
    echo ""
    echo "To start MySQL (if not running):"
    echo "  sudo /usr/local/mysql-9.5.0-macos15-arm64/support-files/mysql.server start"
    echo "  OR use System Preferences > MySQL > Start MySQL Server"
fi

