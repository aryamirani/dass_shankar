-- =====================================================
-- 12: Fix Missing Foreign Keys
-- =====================================================
-- Run this to fix the connection between Students and Grades
-- This is required for fetching student details like "Grade 1" from the database

-- Add Foreign Key from students.grade_id to grades.id
ALTER TABLE students
ADD CONSTRAINT fk_students_grade
FOREIGN KEY (grade_id)
REFERENCES grades(id)
ON DELETE SET NULL;

-- Comment
COMMENT ON CONSTRAINT fk_students_grade ON students IS 
    'Links students to their grade level';
