-- =====================================================
-- Create First Admin User
-- =====================================================
-- INSTRUCTIONS:
-- 1. First, create a user in Supabase Auth Dashboard:
--    - Go to Authentication → Users → Add User
--    - Email: admin@example.com (or your preferred email)
--    - Password: (choose a secure password)
--    - Copy the user ID after creation
--
-- 2. Then run this SQL, replacing <USER_ID> with the actual user ID:

INSERT INTO user_roles (user_id, role) VALUES
('94ce6907-cc26-4ea5-9946-95fea9945af4', 'admin');

-- Example (replace with your actual user ID):
-- INSERT INTO user_roles (user_id, role) VALUES
-- ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin');

-- =====================================================
-- Verify Admin User
-- =====================================================
-- Run this to verify the admin role was created:
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
