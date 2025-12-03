-- Insert test user with ID 2
INSERT INTO users (id, email, password, name, role, avatar_url, location, bio) 
VALUES (2, 'testuser@example.com', 'password123', 'Test User', 'Owner', 'https://i.pravatar.cc/150?img=12', 'San Francisco, CA', 'Pet lover and community enthusiast!')
ON DUPLICATE KEY UPDATE id=id;
