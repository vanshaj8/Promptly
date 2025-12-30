package com.promptly.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String datasourceUsername;

    /**
     * Test database connection on startup
     */
    @Bean
    public CommandLineRunner testDatabaseConnection(DataSource dataSource, JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                logger.info("Testing database connection...");
                logger.info("Database URL: {}", datasourceUrl);
                logger.info("Database User: {}", datasourceUsername);

                // Test basic connection
                jdbcTemplate.execute("SELECT 1");
                logger.info("✓ Database connection successful!");

                // Test database exists
                String dbName = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
                logger.info("✓ Connected to database: {}", dbName);

                // Test tables exist
                Integer tableCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ?",
                    Integer.class,
                    dbName
                );
                logger.info("✓ Found {} tables in database", tableCount);

                // Test required tables
                String[] requiredTables = {"brands", "users", "instagram_accounts", "comments", "replies", "admin_activity_logs"};
                for (String table : requiredTables) {
                    try {
                        Integer count = jdbcTemplate.queryForObject(
                            "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ? AND table_name = ?",
                            Integer.class,
                            dbName, table
                        );
                        if (count > 0) {
                            logger.info("✓ Table '{}' exists", table);
                        } else {
                            logger.warn("⚠ Table '{}' is missing!", table);
                        }
                    } catch (Exception e) {
                        logger.error("✗ Error checking table '{}': {}", table, e.getMessage());
                    }
                }

                logger.info("Database connectivity check completed!");
            } catch (Exception e) {
                logger.error("✗ Database connection failed: {}", e.getMessage(), e);
                throw new RuntimeException("Database connection test failed", e);
            }
        };
    }
}

