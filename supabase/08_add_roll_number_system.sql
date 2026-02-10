-- =====================================================
-- Add Student Roll Number System & Parent Requests
-- =====================================================
-- This migration adds:
-- 1. Roll number as unique identifier for students
-- 2. Parent request system for admin approval and linking

-- =====================================================
-- Part 1: Add Roll Number to Students
-- =====================================================

-- Add roll_no column to students table
ALTER TABLE students 
ADD COLUMN roll_no TEXT;

-- Create unique index for roll numbers
CREATE UNIQUE INDEX idx_students_roll_no ON students(roll_no) WHERE roll_no IS NOT NULL;

-- Add constraint to ensure roll_no format (YYYY-GRADE-NNN)
-- Example: 2024-X-001, 2024-X2-042
ALTER TABLE students
ADD CONSTRAINT roll_no_format CHECK (
    roll_no IS NULL OR 
    roll_no ~ '^[0-9]{4}-(1|2)-[0-9]{3}$'
);

-- =====================================================
-- Part 2: Create Parent Requests Table
-- =====================================================

-- Table to store parent signup requests with student details
CREATE TABLE parent_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_roll_no TEXT NOT NULL,
    grade_name TEXT NOT NULL, -- 'Grade 1' or 'Grade 2'
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES auth.users(id),
    notes TEXT -- Admin notes about the request
);

-- Indexes for faster queries
CREATE INDEX idx_parent_requests_status ON parent_requests(status);
CREATE INDEX idx_parent_requests_roll_no ON parent_requests(student_roll_no);
CREATE INDEX idx_parent_requests_parent_id ON parent_requests(parent_id);

-- =====================================================
-- Part 3: Add Parent Approval Status
-- =====================================================

-- Add approval_status to parents table (similar to teachers)
ALTER TABLE parents 
ADD COLUMN approval_status TEXT DEFAULT 'pending' 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add index for faster queries
CREATE INDEX idx_parents_approval_status ON parents(approval_status);

-- Update existing parents to 'approved' (so they don't get locked out)
UPDATE parents SET approval_status = 'approved';

-- =====================================================
-- Part 4: Helper Function to Find Student by Roll Number
-- =====================================================

-- Function to search for student by roll number
CREATE OR REPLACE FUNCTION find_student_by_roll_no(search_roll_no TEXT)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    roll_number TEXT,
    grade_name TEXT,
    teacher_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.full_name,
        s.roll_no,
        g.name,
        t.full_name
    FROM students s
    LEFT JOIN grades g ON s.grade_id = g.id
    LEFT JOIN teachers t ON s.teacher_id = t.id
    WHERE s.roll_no = search_roll_no;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check students table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students' AND column_name = 'roll_no';

-- Check parent_requests table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'parent_requests'
ORDER BY ordinal_position;

-- Count parent requests by status
SELECT 
    status,
    COUNT(*) as count
FROM parent_requests
GROUP BY status;

-- Example: Find student by roll number
-- SELECT * FROM find_student_by_roll_no('2024-X-001');
