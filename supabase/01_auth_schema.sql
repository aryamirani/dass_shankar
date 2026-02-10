-- =====================================================
-- 01: Authentication & User Management Schema
-- =====================================================
-- Run this file FIRST in Supabase SQL Editor
-- This creates the core user tables and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- User Roles Enum
-- =====================================================
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent');

-- =====================================================
-- Teachers Table
-- =====================================================
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Parents Table
-- =====================================================
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Students Table (No auth - managed by teachers)
-- =====================================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    grade_id UUID, -- Will reference grades table (created in next file)
    date_of_birth DATE,
    created_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Teacher-Student Relationship (Many-to-Many)
-- =====================================================
CREATE TABLE teacher_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, student_id)
);

-- =====================================================
-- Parent-Student Relationship (Many-to-Many)
-- =====================================================
CREATE TABLE parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    relationship TEXT, -- e.g., 'mother', 'father', 'guardian'
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- =====================================================
-- User Roles Mapping (for auth.users)
-- =====================================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_parents_user_id ON parents(user_id);
CREATE INDEX idx_parents_email ON parents(email);
CREATE INDEX idx_students_grade ON students(grade_id);
CREATE INDEX idx_teacher_students_teacher ON teacher_students(teacher_id);
CREATE INDEX idx_teacher_students_student ON teacher_students(student_id);
CREATE INDEX idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON parent_students(student_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- =====================================================
-- Triggers for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE teachers IS 'Teachers who can manage students and view their progress';
COMMENT ON TABLE parents IS 'Parents who can view their children''s progress';
COMMENT ON TABLE students IS 'Students (no direct login) managed by teachers';
COMMENT ON TABLE teacher_students IS 'Many-to-many relationship between teachers and students';
COMMENT ON TABLE parent_students IS 'Many-to-many relationship between parents and students';
COMMENT ON TABLE user_roles IS 'Maps auth.users to their role (admin/teacher/parent)';
