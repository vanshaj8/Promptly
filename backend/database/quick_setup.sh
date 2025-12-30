#!/bin/bash
echo "========================================="
echo "Promptly Database Setup"
echo "========================================="
echo ""
echo "This script will set up the Promptly database."
echo "You will be prompted for your MySQL root password."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""
mysql -u root -p < setup.sql
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Default users created:"
    echo "  Admin: admin@promptly.com / admin123"
    echo "  Brand User: brand@demo.com / admin123"
    echo ""
    echo "⚠️  IMPORTANT: Change these passwords in production!"
else
    echo ""
    echo "❌ Database setup failed. Please check your MySQL credentials."
fi
