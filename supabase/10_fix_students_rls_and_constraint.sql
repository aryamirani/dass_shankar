-- =====================================================
-- 10: Fix Students RLS and Roll Number Constraint
-- =====================================================
-- Run this to fix the "new row violates row-level security policy" error
-- and to relax the roll number format validation.

-- 1. Drop existing restrictive policies on students
DROP POLICY IF EXISTS "Teachers can insert students" ON students;

-- 2. Create a robust policy for inserting students
-- This checks if the user has a 'teacher' role in user_roles
CREATE POLICY "Teachers can insert students" ON students
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- 3. Remove the strict roll number format constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS roll_no_format;

-- 4. Ensure teachers can see the students they just created
-- (Existing policy "Teachers can view assigned students" covers linked students)
-- But we might need to allow viewing unassigned students created by them?
-- For now, the dashboard links them immediately, so standard policy works once linked.

-- 5. Comments
COMMENT ON POLICY "Teachers can insert students" ON students IS 
    'Allows teachers to create student records';
