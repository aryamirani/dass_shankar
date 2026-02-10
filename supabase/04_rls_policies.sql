-- =====================================================
-- 04: Row Level Security (RLS) Policies
-- =====================================================
-- Run this file FOURTH in Supabase SQL Editor
-- This sets up security policies for role-based access control

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper Function: Get User Role
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM user_roles WHERE user_id = p_user_id LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- Helper Function: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- Helper Function: Check if user is teacher
-- =====================================================
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'teacher'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- Helper Function: Check if user is parent
-- =====================================================
CREATE OR REPLACE FUNCTION is_parent()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'parent'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- RLS Policies: Teachers Table
-- =====================================================
-- Admins can see all teachers
CREATE POLICY "Admins can view all teachers" ON teachers
    FOR SELECT USING (is_admin());

-- Teachers can view their own record
CREATE POLICY "Teachers can view own record" ON teachers
    FOR SELECT USING (user_id = auth.uid());

-- Admins can insert teachers
CREATE POLICY "Admins can insert teachers" ON teachers
    FOR INSERT WITH CHECK (is_admin());

-- Teachers can update their own record
CREATE POLICY "Teachers can update own record" ON teachers
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can update any teacher
CREATE POLICY "Admins can update teachers" ON teachers
    FOR UPDATE USING (is_admin());

-- =====================================================
-- RLS Policies: Parents Table
-- =====================================================
-- Admins can see all parents
CREATE POLICY "Admins can view all parents" ON parents
    FOR SELECT USING (is_admin());

-- Parents can view their own record
CREATE POLICY "Parents can view own record" ON parents
    FOR SELECT USING (user_id = auth.uid());

-- Admins can insert parents
CREATE POLICY "Admins can insert parents" ON parents
    FOR INSERT WITH CHECK (is_admin());

-- Parents can update their own record
CREATE POLICY "Parents can update own record" ON parents
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can update any parent
CREATE POLICY "Admins can update parents" ON parents
    FOR UPDATE USING (is_admin());

-- =====================================================
-- RLS Policies: Students Table
-- =====================================================
-- Admins can see all students
CREATE POLICY "Admins can view all students" ON students
    FOR SELECT USING (is_admin());

-- Teachers can see their assigned students
CREATE POLICY "Teachers can view assigned students" ON students
    FOR SELECT USING (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teacher_students ts
            JOIN teachers t ON ts.teacher_id = t.id
            WHERE ts.student_id = students.id AND t.user_id = auth.uid()
        )
    );

-- Parents can see their children
CREATE POLICY "Parents can view their children" ON students
    FOR SELECT USING (
        is_parent() AND EXISTS (
            SELECT 1 FROM parent_students ps
            JOIN parents p ON ps.parent_id = p.id
            WHERE ps.student_id = students.id AND p.user_id = auth.uid()
        )
    );

-- Teachers can insert students
CREATE POLICY "Teachers can insert students" ON students
    FOR INSERT WITH CHECK (is_teacher());

-- Admins can insert students
CREATE POLICY "Admins can insert students" ON students
    FOR INSERT WITH CHECK (is_admin());

-- Teachers can update their assigned students
CREATE POLICY "Teachers can update assigned students" ON students
    FOR UPDATE USING (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teacher_students ts
            JOIN teachers t ON ts.teacher_id = t.id
            WHERE ts.student_id = students.id AND t.user_id = auth.uid()
        )
    );

-- Admins can update any student
CREATE POLICY "Admins can update students" ON students
    FOR UPDATE USING (is_admin());

-- =====================================================
-- RLS Policies: Teacher-Student Relationships
-- =====================================================
-- Admins can see all relationships
CREATE POLICY "Admins can view all teacher-student relationships" ON teacher_students
    FOR SELECT USING (is_admin());

-- Teachers can see their own relationships
CREATE POLICY "Teachers can view own relationships" ON teacher_students
    FOR SELECT USING (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teachers t
            WHERE t.id = teacher_students.teacher_id AND t.user_id = auth.uid()
        )
    );

-- Teachers can create relationships for themselves
CREATE POLICY "Teachers can create own relationships" ON teacher_students
    FOR INSERT WITH CHECK (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teachers t
            WHERE t.id = teacher_students.teacher_id AND t.user_id = auth.uid()
        )
    );

-- Admins can create any relationship
CREATE POLICY "Admins can create teacher-student relationships" ON teacher_students
    FOR INSERT WITH CHECK (is_admin());

-- =====================================================
-- RLS Policies: Parent-Student Relationships
-- =====================================================
-- Admins can see all relationships
CREATE POLICY "Admins can view all parent-student relationships" ON parent_students
    FOR SELECT USING (is_admin());

-- Parents can see their own relationships
CREATE POLICY "Parents can view own relationships" ON parent_students
    FOR SELECT USING (
        is_parent() AND EXISTS (
            SELECT 1 FROM parents p
            WHERE p.id = parent_students.parent_id AND p.user_id = auth.uid()
        )
    );

-- Admins can create relationships
CREATE POLICY "Admins can create parent-student relationships" ON parent_students
    FOR INSERT WITH CHECK (is_admin());

-- =====================================================
-- RLS Policies: User Roles
-- =====================================================
-- Users can view their own role
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" ON user_roles
    FOR SELECT USING (is_admin());

-- Admins can insert roles
CREATE POLICY "Admins can insert roles" ON user_roles
    FOR INSERT WITH CHECK (is_admin());

-- =====================================================
-- RLS Policies: Curriculum Tables (Public Read)
-- =====================================================
-- Everyone can read grades, books, modules, exercises
CREATE POLICY "Public can view grades" ON grades FOR SELECT USING (TRUE);
CREATE POLICY "Public can view books" ON books FOR SELECT USING (TRUE);
CREATE POLICY "Public can view modules" ON modules FOR SELECT USING (TRUE);
CREATE POLICY "Public can view exercises" ON exercises FOR SELECT USING (TRUE);

-- Only admins can modify curriculum
CREATE POLICY "Admins can insert grades" ON grades FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update grades" ON grades FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert books" ON books FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update books" ON books FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert modules" ON modules FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update modules" ON modules FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert exercises" ON exercises FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update exercises" ON exercises FOR UPDATE USING (is_admin());

-- =====================================================
-- RLS Policies: Student Progress
-- =====================================================
-- Admins can see all progress
CREATE POLICY "Admins can view all progress" ON student_progress
    FOR SELECT USING (is_admin());

-- Teachers can see progress of their assigned students
CREATE POLICY "Teachers can view assigned students progress" ON student_progress
    FOR SELECT USING (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teacher_students ts
            JOIN teachers t ON ts.teacher_id = t.id
            WHERE ts.student_id = student_progress.student_id AND t.user_id = auth.uid()
        )
    );

-- Parents can see their children's progress
CREATE POLICY "Parents can view children progress" ON student_progress
    FOR SELECT USING (
        is_parent() AND EXISTS (
            SELECT 1 FROM parent_students ps
            JOIN parents p ON ps.parent_id = p.id
            WHERE ps.student_id = student_progress.student_id AND p.user_id = auth.uid()
        )
    );

-- Teachers can insert/update progress for their assigned students
CREATE POLICY "Teachers can insert progress for assigned students" ON student_progress
    FOR INSERT WITH CHECK (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teacher_students ts
            JOIN teachers t ON ts.teacher_id = t.id
            WHERE ts.student_id = student_progress.student_id AND t.user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update progress for assigned students" ON student_progress
    FOR UPDATE USING (
        is_teacher() AND EXISTS (
            SELECT 1 FROM teacher_students ts
            JOIN teachers t ON ts.teacher_id = t.id
            WHERE ts.student_id = student_progress.student_id AND t.user_id = auth.uid()
        )
    );

-- Admins can insert/update any progress
CREATE POLICY "Admins can insert progress" ON student_progress
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update progress" ON student_progress
    FOR UPDATE USING (is_admin());

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON FUNCTION is_admin IS 'Returns TRUE if current user is an admin';
COMMENT ON FUNCTION is_teacher IS 'Returns TRUE if current user is a teacher';
COMMENT ON FUNCTION is_parent IS 'Returns TRUE if current user is a parent';
