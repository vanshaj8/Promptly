-- Brands table (tenants)
CREATE TABLE IF NOT EXISTS brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table (both admin and brand users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'BRAND_USER') NOT NULL,
  brand_id INT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_brand_id (brand_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Instagram accounts table
CREATE TABLE IF NOT EXISTS instagram_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT NOT NULL,
  instagram_business_account_id VARCHAR(255) NOT NULL,
  facebook_page_id VARCHAR(255) NOT NULL,
  page_access_token TEXT NOT NULL,
  username VARCHAR(255),
  profile_picture_url TEXT,
  is_connected BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  UNIQUE KEY unique_instagram_account (instagram_business_account_id),
  INDEX idx_brand_id (brand_id),
  INDEX idx_is_connected (is_connected)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_id INT NOT NULL,
  instagram_account_id INT NOT NULL,
  comment_id VARCHAR(255) NOT NULL UNIQUE,
  media_id VARCHAR(255),
  parent_id VARCHAR(255) NULL,
  text TEXT NOT NULL,
  username VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  timestamp DATETIME NOT NULL,
  like_count INT DEFAULT 0,
  status ENUM('OPEN', 'REPLIED', 'HIDDEN') DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  FOREIGN KEY (instagram_account_id) REFERENCES instagram_accounts(id) ON DELETE CASCADE,
  INDEX idx_brand_id (brand_id),
  INDEX idx_status (status),
  INDEX idx_timestamp (timestamp),
  INDEX idx_comment_id (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  brand_id INT NOT NULL,
  user_id INT NOT NULL,
  reply_id VARCHAR(255) NOT NULL UNIQUE,
  text TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_comment_id (comment_id),
  INDEX idx_brand_id (brand_id),
  INDEX idx_reply_id (reply_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id INT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_user_id (admin_user_id),
  INDEX idx_action_type (action_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

