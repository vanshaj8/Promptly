-- Seed data for testing
-- Default admin user (password: admin123 - change in production!)
-- To generate a new password hash, run: node scripts/generate-password.js <password>

INSERT INTO brands (id, name, category, is_active) VALUES
(1, 'Demo Brand', 'Retail', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Password hash for 'admin123' generated with bcrypt (10 rounds)
-- Run: node scripts/generate-password.js admin123 to generate a new hash
INSERT INTO users (id, email, password_hash, role, brand_id, full_name) VALUES
(1, 'admin@promptly.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NULL, 'Admin User'),
(2, 'brand@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 1, 'Brand User')
ON DUPLICATE KEY UPDATE email=email;

