-- Random seed data for testing and development
-- Password hash for 'admin123' (all users use this for testing)
-- Generated with: node scripts/generate-password.js admin123

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM replies;
-- DELETE FROM comments;
-- DELETE FROM admin_activity_logs;
-- DELETE FROM instagram_accounts;
-- DELETE FROM users WHERE role = 'BRAND_USER';
-- DELETE FROM brands WHERE id > 1;

-- Insert multiple brands
INSERT INTO brands (id, name, category, is_active) VALUES
(1, 'Demo Brand', 'Retail', TRUE),
(2, 'TechStart Inc', 'Technology', TRUE),
(3, 'Fashion Forward', 'Fashion', TRUE),
(4, 'Foodie Delights', 'Food & Beverage', TRUE),
(5, 'FitLife Gym', 'Fitness', TRUE),
(6, 'Beauty Essentials', 'Beauty', TRUE),
(7, 'Home Decor Co', 'Home & Living', TRUE),
(8, 'Pet Paradise', 'Pet Care', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Insert users (password: admin123 for all)
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, email, password_hash, role, brand_id, full_name) VALUES
(1, 'admin@promptly.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NULL, 'Admin User'),
(2, 'brand@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 1, 'John Smith'),
(3, 'tech@techstart.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 2, 'Sarah Johnson'),
(4, 'fashion@fashionforward.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 3, 'Emma Williams'),
(5, 'food@foodiedelights.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 4, 'Michael Brown'),
(6, 'fitness@fitlife.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 5, 'David Martinez'),
(7, 'beauty@beautyessentials.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 6, 'Lisa Anderson'),
(8, 'home@homedecor.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 7, 'Robert Taylor'),
(9, 'pets@petparadise.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BRAND_USER', 8, 'Jennifer Davis')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Instagram accounts for brands
INSERT INTO instagram_accounts (id, brand_id, instagram_business_account_id, facebook_page_id, page_access_token, username, profile_picture_url, is_connected, last_sync_at) VALUES
(1, 1, '17841405309211844', '123456789012345', 'EAABwzLixnjYBO7ZC...', 'demobrand', 'https://example.com/pics/demobrand.jpg', TRUE, NOW() - INTERVAL 2 HOUR),
(2, 2, '17841405309211845', '123456789012346', 'EAABwzLixnjYBO7ZC...', 'techstart', 'https://example.com/pics/techstart.jpg', TRUE, NOW() - INTERVAL 1 HOUR),
(3, 3, '17841405309211846', '123456789012347', 'EAABwzLixnjYBO7ZC...', 'fashionforward', 'https://example.com/pics/fashionforward.jpg', TRUE, NOW() - INTERVAL 30 MINUTE),
(4, 4, '17841405309211847', '123456789012348', 'EAABwzLixnjYBO7ZC...', 'foodiedelights', 'https://example.com/pics/foodiedelights.jpg', TRUE, NOW() - INTERVAL 15 MINUTE),
(5, 5, '17841405309211848', '123456789012349', 'EAABwzLixnjYBO7ZC...', 'fitlifegym', 'https://example.com/pics/fitlife.jpg', TRUE, NOW() - INTERVAL 5 MINUTE),
(6, 6, '17841405309211849', '123456789012350', 'EAABwzLixnjYBO7ZC...', 'beautyessentials', 'https://example.com/pics/beauty.jpg', TRUE, NOW() - INTERVAL 10 MINUTE),
(7, 7, '17841405309211850', '123456789012351', 'EAABwzLixnjYBO7ZC...', 'homedecorco', 'https://example.com/pics/home.jpg', TRUE, NOW() - INTERVAL 20 MINUTE),
(8, 8, '17841405309211851', '123456789012352', 'EAABwzLixnjYBO7ZC...', 'petparadise', 'https://example.com/pics/pets.jpg', TRUE, NOW() - INTERVAL 45 MINUTE)
ON DUPLICATE KEY UPDATE username=username;

-- Insert comments (mix of OPEN, REPLIED, and HIDDEN status)
INSERT INTO comments (brand_id, instagram_account_id, comment_id, media_id, parent_id, text, username, user_id, timestamp, like_count, status) VALUES
-- Brand 1 (Demo Brand) - 8 comments
(1, 1, '17841512345678901', '17841598765432101', NULL, 'Love this product! When will it be back in stock?', 'customer_jane', '17841511111111', NOW() - INTERVAL 2 DAY, 5, 'OPEN'),
(1, 1, '17841512345678902', '17841598765432101', NULL, 'Amazing quality! Highly recommend!', 'shopper_mike', '17841511111112', NOW() - INTERVAL 1 DAY, 12, 'REPLIED'),
(1, 1, '17841512345678903', '17841598765432102', NULL, 'Is this available in size large?', 'fashion_lover', '17841511111113', NOW() - INTERVAL 12 HOUR, 3, 'OPEN'),
(1, 1, '17841512345678904', '17841598765432102', NULL, 'Great service! Fast shipping!', 'happy_customer', '17841511111114', NOW() - INTERVAL 6 HOUR, 8, 'REPLIED'),
(1, 1, '17841512345678905', '17841598765432103', NULL, 'Do you ship internationally?', 'global_buyer', '17841511111115', NOW() - INTERVAL 3 HOUR, 2, 'OPEN'),
(1, 1, '17841512345678906', '17841598765432103', NULL, 'This is spam content', 'spam_user', '17841511111116', NOW() - INTERVAL 1 HOUR, 0, 'HIDDEN'),
(1, 1, '17841512345678907', '17841598765432104', NULL, 'What colors are available?', 'color_enthusiast', '17841511111117', NOW() - INTERVAL 30 MINUTE, 4, 'OPEN'),
(1, 1, '17841512345678908', '17841598765432104', NULL, 'Perfect for my needs!', 'satisfied_user', '17841511111118', NOW() - INTERVAL 15 MINUTE, 7, 'REPLIED'),

-- Brand 2 (TechStart) - 6 comments
(2, 2, '17841512345678911', '17841598765432111', NULL, 'When is the new update coming?', 'tech_fan', '17841511111121', NOW() - INTERVAL 1 DAY, 15, 'OPEN'),
(2, 2, '17841512345678912', '17841598765432111', NULL, 'Great app! Love the new features!', 'app_user', '17841511111122', NOW() - INTERVAL 18 HOUR, 23, 'REPLIED'),
(2, 2, '17841512345678913', '17841598765432112', NULL, 'Having issues with login. Help?', 'user_help', '17841511111123', NOW() - INTERVAL 8 HOUR, 1, 'OPEN'),
(2, 2, '17841512345678914', '17841598765432112', NULL, 'Best tech product I\'ve used!', 'tech_reviewer', '17841511111124', NOW() - INTERVAL 4 HOUR, 9, 'REPLIED'),
(2, 2, '17841512345678915', '17841598765432113', NULL, 'Is there a mobile app?', 'mobile_user', '17841511111125', NOW() - INTERVAL 2 HOUR, 6, 'OPEN'),
(2, 2, '17841512345678916', '17841598765432113', NULL, 'Amazing interface design!', 'design_lover', '17841511111126', NOW() - INTERVAL 1 HOUR, 11, 'REPLIED'),

-- Brand 3 (Fashion Forward) - 7 comments
(3, 3, '17841512345678921', '17841598765432121', NULL, 'This dress is gorgeous! Where can I buy it?', 'fashionista', '17841511111131', NOW() - INTERVAL 1 DAY, 45, 'OPEN'),
(3, 3, '17841512345678922', '17841598765432121', NULL, 'Love your style!', 'style_follower', '17841511111132', NOW() - INTERVAL 16 HOUR, 28, 'REPLIED'),
(3, 3, '17841512345678923', '17841598765432122', NULL, 'What size should I get?', 'size_question', '17841511111133', NOW() - INTERVAL 10 HOUR, 3, 'OPEN'),
(3, 3, '17841512345678924', '17841598765432122', NULL, 'Beautiful collection!', 'collection_fan', '17841511111134', NOW() - INTERVAL 5 HOUR, 19, 'REPLIED'),
(3, 3, '17841512345678925', '17841598765432123', NULL, 'Do you have this in red?', 'color_seeker', '17841511111135', NOW() - INTERVAL 3 HOUR, 5, 'OPEN'),
(3, 3, '17841512345678926', '17841598765432123', NULL, 'Perfect fit! Highly recommend!', 'happy_shopper', '17841511111136', NOW() - INTERVAL 1 HOUR, 14, 'REPLIED'),
(3, 3, '17841512345678927', '17841598765432124', NULL, 'When is the sale starting?', 'sale_watcher', '17841511111137', NOW() - INTERVAL 30 MINUTE, 8, 'OPEN'),

-- Brand 4 (Foodie Delights) - 5 comments
(4, 4, '17841512345678931', '17841598765432131', NULL, 'This looks delicious! Recipe please?', 'food_lover', '17841511111141', NOW() - INTERVAL 1 DAY, 32, 'OPEN'),
(4, 4, '17841512345678932', '17841598765432131', NULL, 'Made this for dinner - amazing!', 'home_chef', '17841511111142', NOW() - INTERVAL 20 HOUR, 18, 'REPLIED'),
(4, 4, '17841512345678933', '17841598765432132', NULL, 'Do you deliver to downtown?', 'delivery_asker', '17841511111143', NOW() - INTERVAL 6 HOUR, 2, 'OPEN'),
(4, 4, '17841512345678934', '17841598765432132', NULL, 'Best restaurant in town!', 'local_foodie', '17841511111144', NOW() - INTERVAL 2 HOUR, 25, 'REPLIED'),
(4, 4, '17841512345678935', '17841598765432133', NULL, 'What are your vegan options?', 'vegan_diner', '17841511111145', NOW() - INTERVAL 1 HOUR, 7, 'OPEN'),

-- Brand 5 (FitLife Gym) - 6 comments
(5, 5, '17841512345678941', '17841598765432141', NULL, 'What are your membership rates?', 'potential_member', '17841511111151', NOW() - INTERVAL 1 DAY, 4, 'OPEN'),
(5, 5, '17841512345678942', '17841598765432141', NULL, 'Great gym! Love the trainers!', 'gym_member', '17841511111152', NOW() - INTERVAL 14 HOUR, 12, 'REPLIED'),
(5, 5, '17841512345678943', '17841598765432142', NULL, 'Do you have yoga classes?', 'yoga_enthusiast', '17841511111153', NOW() - INTERVAL 7 HOUR, 3, 'OPEN'),
(5, 5, '17841512345678944', '17841598765432142', NULL, 'Best workout facility!', 'fitness_fan', '17841511111154', NOW() - INTERVAL 3 HOUR, 9, 'REPLIED'),
(5, 5, '17841512345678945', '17841598765432143', NULL, 'What are your operating hours?', 'schedule_asker', '17841511111155', NOW() - INTERVAL 2 HOUR, 1, 'OPEN'),
(5, 5, '17841512345678946', '17841598765432143', NULL, 'Amazing results! Thank you!', 'success_story', '17841511111156', NOW() - INTERVAL 45 MINUTE, 16, 'REPLIED'),

-- Brand 6 (Beauty Essentials) - 5 comments
(6, 6, '17841512345678951', '17841598765432151', NULL, 'Does this work for sensitive skin?', 'sensitive_skin', '17841511111161', NOW() - INTERVAL 1 DAY, 6, 'OPEN'),
(6, 6, '17841512345678952', '17841598765432151', NULL, 'Love this product! My skin looks amazing!', 'beauty_lover', '17841511111162', NOW() - INTERVAL 12 HOUR, 21, 'REPLIED'),
(6, 6, '17841512345678953', '17841598765432152', NULL, 'Is it cruelty-free?', 'ethical_buyer', '17841511111163', NOW() - INTERVAL 5 HOUR, 4, 'OPEN'),
(6, 6, '17841512345678954', '17841598765432152', NULL, 'Best skincare routine!', 'skincare_fan', '17841511111164', NOW() - INTERVAL 2 HOUR, 13, 'REPLIED'),
(6, 6, '17841512345678955', '17841598765432153', NULL, 'How long does shipping take?', 'impatient_buyer', '17841511111165', NOW() - INTERVAL 1 HOUR, 2, 'OPEN'),

-- Brand 7 (Home Decor Co) - 4 comments
(7, 7, '17841512345678961', '17841598765432161', NULL, 'This would look perfect in my living room!', 'home_decorator', '17841511111171', NOW() - INTERVAL 1 DAY, 19, 'OPEN'),
(7, 7, '17841512345678962', '17841598765432161', NULL, 'Beautiful design! Just ordered!', 'decor_shopper', '17841511111172', NOW() - INTERVAL 15 HOUR, 8, 'REPLIED'),
(7, 7, '17841512345678963', '17841598765432162', NULL, 'What are the dimensions?', 'size_checker', '17841511111173', NOW() - INTERVAL 8 HOUR, 1, 'OPEN'),
(7, 7, '17841512345678964', '17841598765432162', NULL, 'Great quality furniture!', 'furniture_lover', '17841511111174', NOW() - INTERVAL 4 HOUR, 11, 'REPLIED'),

-- Brand 8 (Pet Paradise) - 5 comments
(8, 8, '17841512345678971', '17841598765432171', NULL, 'My dog loves these treats!', 'dog_owner', '17841511111181', NOW() - INTERVAL 1 DAY, 27, 'OPEN'),
(8, 8, '17841512345678972', '17841598765432171', NULL, 'Best pet store ever!', 'pet_parent', '17841511111182', NOW() - INTERVAL 18 HOUR, 15, 'REPLIED'),
(8, 8, '17841512345678973', '17841598765432172', NULL, 'Do you have cat toys?', 'cat_lover', '17841511111183', NOW() - INTERVAL 9 HOUR, 3, 'OPEN'),
(8, 8, '17841512345678974', '17841598765432172', NULL, 'My pets are so happy!', 'happy_pet_owner', '17841511111184', NOW() - INTERVAL 3 HOUR, 9, 'REPLIED'),
(8, 8, '17841512345678975', '17841598765432173', NULL, 'What brands do you carry?', 'brand_seeker', '17841511111185', NOW() - INTERVAL 1 HOUR, 2, 'OPEN')
ON DUPLICATE KEY UPDATE text=text;

-- Insert replies to some comments
INSERT INTO replies (comment_id, brand_id, user_id, reply_id, text, sent_at) VALUES
-- Replies for Brand 1
((SELECT id FROM comments WHERE comment_id = '17841512345678902'), 1, 2, '17841598765432101_reply1', 'Thank you so much! We appreciate your support!', NOW() - INTERVAL 23 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678904'), 1, 2, '17841598765432102_reply1', 'We\'re so glad you\'re happy with your purchase!', NOW() - INTERVAL 5 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678908'), 1, 2, '17841598765432104_reply1', 'Thank you for your kind words!', NOW() - INTERVAL 14 MINUTE),

-- Replies for Brand 2
((SELECT id FROM comments WHERE comment_id = '17841512345678912'), 2, 3, '17841598765432111_reply1', 'We\'re thrilled you love the new features! More coming soon!', NOW() - INTERVAL 17 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678914'), 2, 3, '17841598765432112_reply1', 'Thank you for the amazing review!', NOW() - INTERVAL 3 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678916'), 2, 3, '17841598765432113_reply1', 'We put a lot of thought into the design. Glad you like it!', NOW() - INTERVAL 58 MINUTE),

-- Replies for Brand 3
((SELECT id FROM comments WHERE comment_id = '17841512345678922'), 3, 4, '17841598765432121_reply1', 'Thank you! Check out our latest collection!', NOW() - INTERVAL 15 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678924'), 3, 4, '17841598765432122_reply1', 'We\'re so happy you love it!', NOW() - INTERVAL 4 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678926'), 3, 4, '17841598765432123_reply1', 'Perfect! Thank you for sharing!', NOW() - INTERVAL 58 MINUTE),

-- Replies for Brand 4
((SELECT id FROM comments WHERE comment_id = '17841512345678932'), 4, 5, '17841598765432131_reply1', 'So glad you enjoyed it! Recipe coming soon!', NOW() - INTERVAL 19 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678934'), 4, 5, '17841598765432132_reply1', 'Thank you! We love serving our community!', NOW() - INTERVAL 1 HOUR),

-- Replies for Brand 5
((SELECT id FROM comments WHERE comment_id = '17841512345678942'), 5, 6, '17841598765432141_reply1', 'Thank you! Our trainers are amazing!', NOW() - INTERVAL 13 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678944'), 5, 6, '17841598765432142_reply1', 'We\'re so happy to hear that!', NOW() - INTERVAL 2 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678946'), 5, 6, '17841598765432143_reply1', 'Congratulations on your progress! Keep it up!', NOW() - INTERVAL 44 MINUTE),

-- Replies for Brand 6
((SELECT id FROM comments WHERE comment_id = '17841512345678952'), 6, 7, '17841598765432151_reply1', 'So happy to hear it\'s working for you!', NOW() - INTERVAL 11 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678954'), 6, 7, '17841598765432152_reply1', 'Thank you for being part of our community!', NOW() - INTERVAL 1 HOUR),

-- Replies for Brand 7
((SELECT id FROM comments WHERE comment_id = '17841512345678962'), 7, 8, '17841598765432161_reply1', 'Can\'t wait for you to receive it!', NOW() - INTERVAL 14 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678964'), 7, 8, '17841598765432162_reply1', 'Thank you for your support!', NOW() - INTERVAL 3 HOUR),

-- Replies for Brand 8
((SELECT id FROM comments WHERE comment_id = '17841512345678972'), 8, 9, '17841598765432171_reply1', 'We love our pet community!', NOW() - INTERVAL 17 HOUR),
((SELECT id FROM comments WHERE comment_id = '17841512345678974'), 8, 9, '17841598765432172_reply1', 'That makes us so happy!', NOW() - INTERVAL 2 HOUR)
ON DUPLICATE KEY UPDATE text=text;

-- Insert admin activity logs
INSERT INTO admin_activity_logs (admin_user_id, action_type, target_type, target_id, details, created_at) VALUES
(1, 'CREATE', 'BRAND', 2, '{"name": "TechStart Inc", "category": "Technology"}', NOW() - INTERVAL 7 DAY),
(1, 'CREATE', 'BRAND', 3, '{"name": "Fashion Forward", "category": "Fashion"}', NOW() - INTERVAL 6 DAY),
(1, 'UPDATE', 'BRAND', 1, '{"field": "is_active", "value": true}', NOW() - INTERVAL 5 DAY),
(1, 'CREATE', 'USER', 3, '{"email": "tech@techstart.com", "role": "BRAND_USER"}', NOW() - INTERVAL 5 DAY),
(1, 'CREATE', 'USER', 4, '{"email": "fashion@fashionforward.com", "role": "BRAND_USER"}', NOW() - INTERVAL 4 DAY),
(1, 'CREATE', 'BRAND', 4, '{"name": "Foodie Delights", "category": "Food & Beverage"}', NOW() - INTERVAL 4 DAY),
(1, 'CREATE', 'BRAND', 5, '{"name": "FitLife Gym", "category": "Fitness"}', NOW() - INTERVAL 3 DAY),
(1, 'UPDATE', 'BRAND', 2, '{"field": "category", "old_value": "Tech", "new_value": "Technology"}', NOW() - INTERVAL 3 DAY),
(1, 'CREATE', 'USER', 5, '{"email": "food@foodiedelights.com", "role": "BRAND_USER"}', NOW() - INTERVAL 2 DAY),
(1, 'CREATE', 'USER', 6, '{"email": "fitness@fitlife.com", "role": "BRAND_USER"}', NOW() - INTERVAL 2 DAY),
(1, 'CREATE', 'BRAND', 6, '{"name": "Beauty Essentials", "category": "Beauty"}', NOW() - INTERVAL 1 DAY),
(1, 'CREATE', 'BRAND', 7, '{"name": "Home Decor Co", "category": "Home & Living"}', NOW() - INTERVAL 1 DAY),
(1, 'CREATE', 'BRAND', 8, '{"name": "Pet Paradise", "category": "Pet Care"}', NOW() - INTERVAL 12 HOUR),
(1, 'CREATE', 'USER', 7, '{"email": "beauty@beautyessentials.com", "role": "BRAND_USER"}', NOW() - INTERVAL 10 HOUR),
(1, 'CREATE', 'USER', 8, '{"email": "home@homedecor.com", "role": "BRAND_USER"}', NOW() - INTERVAL 8 HOUR),
(1, 'CREATE', 'USER', 9, '{"email": "pets@petparadise.com", "role": "BRAND_USER"}', NOW() - INTERVAL 6 HOUR),
(1, 'VIEW', 'LOGS', NULL, '{"action": "viewed_activity_logs"}', NOW() - INTERVAL 2 HOUR),
(1, 'UPDATE', 'BRAND', 3, '{"field": "is_active", "value": true}', NOW() - INTERVAL 1 HOUR)
ON DUPLICATE KEY UPDATE details=details;

