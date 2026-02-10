-- =====================================================
-- 09: Fix RLS Policies for Signup
-- =====================================================
-- Run this file to fix RLS policies that block user signup
-- This allows users to create their own records during registration

-- =====================================================
-- Drop existing restrictive policies
-- =====================================================
DROP POLICY IF EXISTS "Admins can insert teachers" ON teachers;
DROP POLICY IF EXISTS "Admins can insert parents" ON parents;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;

-- =====================================================
-- User Roles: Allow users to create their own role
-- =====================================================
-- Users can insert their own role during signup
CREATE POLICY "Users can insert own role" ON user_roles
    FOR INSERT 
    WITH CHECK (user_id = auth.uid());

-- Admins can insert any role
CREATE POLICY "Admins can insert roles" ON user_roles
    FOR INSERT 
    WITH CHECK (is_admin());

-- =====================================================
-- Teachers: Allow teacher signup
-- =====================================================
-- Users can insert their own teacher record during signup
CREATE POLICY "Users can insert own teacher record" ON teachers
    FOR INSERT 
    WITH CHECK (user_id = auth.uid());

-- Admins can insert any teacher
CREATE POLICY "Admins can insert teachers" ON teachers
    FOR INSERT 
    WITH CHECK (is_admin());

-- =====================================================
-- Parents: Allow parent signup
-- =====================================================
-- Users can insert their own parent record during signup
CREATE POLICY "Users can insert own parent record" ON parents
    FOR INSERT 
    WITH CHECK (user_id = auth.uid());

-- Admins can insert any parent
CREATE POLICY "Admins can insert parents" ON parents
    FOR INSERT 
    WITH CHECK (is_admin());

-- =====================================================
-- Parent Requests: Enable RLS and add policies
-- =====================================================
ALTER TABLE parent_requests ENABLE ROW LEVEL SECURITY;

-- Parents can view their own requests
CREATE POLICY "Parents can view own requests" ON parent_requests
    FOR SELECT 
    USING (
        parent_id IN (
            SELECT id FROM parents WHERE user_id = auth.uid()
        )
    );

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON parent_requests
    FOR SELECT 
    USING (is_admin());

-- Parents can insert their own requests
CREATE POLICY "Parents can insert own requests" ON parent_requests
    FOR INSERT 
    WITH CHECK (
        parent_id IN (
            SELECT id FROM parents WHERE user_id = auth.uid()
        )
    );

-- Admins can insert any request
CREATE POLICY "Admins can insert requests" ON parent_requests
    FOR INSERT 
    WITH CHECK (is_admin());

-- Admins can update any request
CREATE POLICY "Admins can update requests" ON parent_requests
    FOR UPDATE 
    USING (is_admin());

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON POLICY "Users can insert own role" ON user_roles IS 
    'Allows users to create their own role entry during signup';

COMMENT ON POLICY "Users can insert own teacher record" ON teachers IS 
    'Allows users to create their own teacher record during signup';

COMMENT ON POLICY "Users can insert own parent record" ON parents IS 
    'Allows users to create their own parent record during signup';

COMMENT ON POLICY "Parents can insert own requests" ON parent_requests IS 
    'Allows parents to create their own parent requests during signup';
