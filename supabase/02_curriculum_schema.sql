-- =====================================================
-- 02: Curriculum Structure Schema
-- =====================================================
-- Run this file SECOND in Supabase SQL Editor
-- This creates the grade/book/module/exercise hierarchy

-- =====================================================
-- Grades Table
-- =====================================================
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'Grade 1', 'Grade 2'
    display_name TEXT NOT NULL, -- e.g., 'Grade 1', 'Grade 2'
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Books Table (A, E, I, O, U per grade)
-- =====================================================
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL, -- 'A', 'E', 'I', 'O', 'U'
    name TEXT NOT NULL, -- e.g., 'Book A', 'Book E'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE, -- Only Book A is active initially
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(grade_id, code)
);

-- =====================================================
-- Modules Table (English, Maths, Health, etc.)
-- =====================================================
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., 'English Module', 'Maths Module'
    slug TEXT NOT NULL, -- e.g., 'english', 'maths', 'health'
    description TEXT,
    icon TEXT, -- emoji or icon identifier
    color TEXT, -- hex color for UI
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, slug)
);

-- =====================================================
-- Exercises Table (Individual exercises within modules)
-- =====================================================
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., 'Counting', 'Matching Game'
    slug TEXT NOT NULL, -- e.g., 'mathsExerciseOne', 'vocabularyExercise'
    description TEXT,
    type TEXT, -- e.g., 'quiz', 'interactive', 'game', 'assessment'
    max_score INTEGER DEFAULT 100,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_books_grade ON books(grade_id);
CREATE INDEX idx_books_active ON books(is_active);
CREATE INDEX idx_modules_book ON modules(book_id);
CREATE INDEX idx_modules_slug ON modules(slug);
CREATE INDEX idx_exercises_module ON exercises(module_id);
CREATE INDEX idx_exercises_slug ON exercises(slug);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE grades IS 'Grade levels (Grade 1, Grade 2)';
COMMENT ON TABLE books IS 'Books within each grade (A, E, I, O, U)';
COMMENT ON TABLE modules IS 'Learning modules within each book (English, Maths, etc.)';
COMMENT ON TABLE exercises IS 'Individual exercises within each module';
