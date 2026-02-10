-- =====================================================
-- 03: Progress Tracking Schema
-- =====================================================
-- Run this file THIRD in Supabase SQL Editor
-- This creates the student progress tracking tables

-- =====================================================
-- Student Progress Table
-- =====================================================
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER, -- Actual score achieved (nullable if not applicable)
    attempts INTEGER DEFAULT 1, -- Number of attempts
    time_spent_seconds INTEGER, -- Time spent on exercise (optional)
    completed_at TIMESTAMP WITH TIME ZONE,
    first_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Unique Constraint: One progress record per student per exercise
-- =====================================================
-- We'll allow multiple attempts but track them in the same record
CREATE UNIQUE INDEX idx_student_exercise_unique ON student_progress(student_id, exercise_id);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_progress_student ON student_progress(student_id);
CREATE INDEX idx_progress_exercise ON student_progress(exercise_id);
CREATE INDEX idx_progress_completed ON student_progress(completed);
CREATE INDEX idx_progress_completed_at ON student_progress(completed_at);

-- =====================================================
-- Trigger for updated_at
-- =====================================================
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function: Get Student Module Progress
-- =====================================================
-- Returns completion percentage for a student in a specific module
CREATE OR REPLACE FUNCTION get_module_progress(p_student_id UUID, p_module_id UUID)
RETURNS TABLE (
    total_exercises INTEGER,
    completed_exercises INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(e.id)::INTEGER AS total_exercises,
        COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::INTEGER AS completed_exercises,
        ROUND(
            (COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::NUMERIC / 
            NULLIF(COUNT(e.id)::NUMERIC, 0)) * 100, 
            2
        ) AS completion_percentage
    FROM exercises e
    LEFT JOIN student_progress sp ON e.id = sp.exercise_id AND sp.student_id = p_student_id
    WHERE e.module_id = p_module_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: Get Student Book Progress
-- =====================================================
-- Returns completion percentage for a student in a specific book
CREATE OR REPLACE FUNCTION get_book_progress(p_student_id UUID, p_book_id UUID)
RETURNS TABLE (
    total_exercises INTEGER,
    completed_exercises INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(e.id)::INTEGER AS total_exercises,
        COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::INTEGER AS completed_exercises,
        ROUND(
            (COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::NUMERIC / 
            NULLIF(COUNT(e.id)::NUMERIC, 0)) * 100, 
            2
        ) AS completion_percentage
    FROM exercises e
    JOIN modules m ON e.module_id = m.id
    LEFT JOIN student_progress sp ON e.id = sp.exercise_id AND sp.student_id = p_student_id
    WHERE m.book_id = p_book_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: Get Student Overall Progress
-- =====================================================
-- Returns overall completion percentage for a student
CREATE OR REPLACE FUNCTION get_student_overall_progress(p_student_id UUID)
RETURNS TABLE (
    total_exercises INTEGER,
    completed_exercises INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(e.id)::INTEGER AS total_exercises,
        COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::INTEGER AS completed_exercises,
        ROUND(
            (COUNT(sp.id) FILTER (WHERE sp.completed = TRUE)::NUMERIC / 
            NULLIF(COUNT(e.id)::NUMERIC, 0)) * 100, 
            2
        ) AS completion_percentage
    FROM exercises e
    LEFT JOIN student_progress sp ON e.id = sp.exercise_id AND sp.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE student_progress IS 'Tracks student progress on exercises with scores and timestamps';
COMMENT ON FUNCTION get_module_progress IS 'Returns completion stats for a student in a specific module';
COMMENT ON FUNCTION get_book_progress IS 'Returns completion stats for a student in a specific book';
COMMENT ON FUNCTION get_student_overall_progress IS 'Returns overall completion stats for a student';
