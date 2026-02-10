-- =====================================================
-- 13: Add Metadata to Student Progress
-- =====================================================
-- Adds flexibility to store additional data like mode, answers, etc.

ALTER TABLE student_progress ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Index for JSONB if needed (optional)
CREATE INDEX IF NOT EXISTS idx_progress_metadata ON student_progress USING GIN (metadata);
