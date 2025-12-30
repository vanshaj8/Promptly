@echo off
REM Database setup script for Promptly (Windows)
REM Usage: setup.bat [mysql_user] [mysql_password]

setlocal

set DB_USER=%1
if "%DB_USER%"=="" set DB_USER=root

set DB_PASSWORD=%2
set DB_NAME=Promptly

echo Setting up Promptly database...

REM Check if MySQL is available
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: MySQL client not found. Please install MySQL first.
    exit /b 1
)

REM Create database
echo Creating database: %DB_NAME%
if "%DB_PASSWORD%"=="" (
    mysql -u %DB_USER% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
) else (
    mysql -u %DB_USER% -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
)

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to create database. Please check your MySQL credentials.
    exit /b 1
)

REM Run schema
echo Running schema.sql...
if "%DB_PASSWORD%"=="" (
    mysql -u %DB_USER% %DB_NAME% < schema.sql
) else (
    mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < schema.sql
)

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to run schema.sql
    exit /b 1
)

REM Run seed data
echo Running seed.sql...
if "%DB_PASSWORD%"=="" (
    mysql -u %DB_USER% %DB_NAME% < seed.sql
) else (
    mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < seed.sql
)

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to run seed.sql
    exit /b 1
)

echo.
echo Database setup completed successfully!
echo.
echo Database: %DB_NAME%
echo Default users created:
echo   Admin: admin@promptly.com / admin123
echo   Brand User: brand@demo.com / admin123
echo.
echo IMPORTANT: Change these passwords in production!

endlocal

