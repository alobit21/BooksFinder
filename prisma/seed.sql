-- Insert test users with hashed passwords
-- Password: password123 (hashed with bcrypt, cost 12)

INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES 
  ('cuid1', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Test User', NOW(), NOW()),
  ('cuid2', 'alice@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Alice Johnson', NOW(), NOW()),
  ('cuid3', 'bob@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Bob Smith', NOW(), NOW()),
  ('cuid4', 'charlie@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUpm', 'Charlie Brown', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
