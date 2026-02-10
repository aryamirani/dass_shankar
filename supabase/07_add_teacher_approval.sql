-- =====================================================
-- Add Teacher Approval System
-- =====================================================
-- This migration adds an approval workflow for teachers.
-- Teachers must be approved by an admin before accessing the system.

-- Add approval_status column to teachers table
ALTER TABLE teachers 
ADD COLUMN approval_status TEXT DEFAULT 'pending' 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add index for faster queries on approval status
CREATE INDEX idx_teachers_approval_status ON teachers(approval_status);

-- Update existing teachers to 'approved' status
-- (so they don't get locked out after migration)
UPDATE teachers SET approval_status = 'approved';

-- =====================================================
-- Verify Migration
-- =====================================================
-- Run this to see all teachers and their approval status:
SELECT 
    t.id,
    t.full_name,
    t.email,
    t.approval_status,
    t.created_at
FROM teachers t
ORDER BY t.created_at DESC;

-- Count teachers by status:
SELECT 
    approval_status,
    COUNT(*) as count
FROM teachers
GROUP BY approval_status;
