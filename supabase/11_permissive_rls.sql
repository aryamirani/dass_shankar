-- =====================================================
-- 11: Permissive RLS Policies (Development Mode)
-- =====================================================
-- Run this to ALLOW ALL OPERATIONS for everyone.
-- WARNING: This effectively disables security. Use only for development.

-- Helper macro to create permissive policies
-- We have to do this table by table because Postgres doesn't allow "ALL TABLES" wildcards for policies.

-- 1. Teachers
DROP POLICY IF EXISTS "Admins can view all teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can view own record" ON teachers;
DROP POLICY IF EXISTS "Admins can insert teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own record" ON teachers;
DROP POLICY IF EXISTS "Admins can update teachers" ON teachers;
DROP POLICY IF EXISTS "Users can insert own teacher record" ON teachers;

CREATE POLICY "Allow all on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);

-- 2. Parents
DROP POLICY IF EXISTS "Admins can view all parents" ON parents;
DROP POLICY IF EXISTS "Parents can view own record" ON parents;
DROP POLICY IF EXISTS "Admins can insert parents" ON parents;
DROP POLICY IF EXISTS "Parents can update own record" ON parents;
DROP POLICY IF EXISTS "Admins can update parents" ON parents;
DROP POLICY IF EXISTS "Users can insert own parent record" ON parents;

CREATE POLICY "Allow all on parents" ON parents FOR ALL USING (true) WITH CHECK (true);

-- 3. Students
DROP POLICY IF EXISTS "Admins can view all students" ON students;
DROP POLICY IF EXISTS "Teachers can view assigned students" ON students;
DROP POLICY IF EXISTS "Parents can view their children" ON students;
DROP POLICY IF EXISTS "Teachers can insert students" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Teachers can update assigned students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;

CREATE POLICY "Allow all on students" ON students FOR ALL USING (true) WITH CHECK (true);

-- 4. Teacher-Student
DROP POLICY IF EXISTS "Admins can view all teacher-student relationships" ON teacher_students;
DROP POLICY IF EXISTS "Teachers can view own relationships" ON teacher_students;
DROP POLICY IF EXISTS "Teachers can create own relationships" ON teacher_students;
DROP POLICY IF EXISTS "Admins can create teacher-student relationships" ON teacher_students;

CREATE POLICY "Allow all on teacher_students" ON teacher_students FOR ALL USING (true) WITH CHECK (true);

-- 5. Parent-Student
DROP POLICY IF EXISTS "Admins can view all parent-student relationships" ON parent_students;
DROP POLICY IF EXISTS "Parents can view own relationships" ON parent_students;
DROP POLICY IF EXISTS "Admins can create parent-student relationships" ON parent_students;

CREATE POLICY "Allow all on parent_students" ON parent_students FOR ALL USING (true) WITH CHECK (true);

-- 6. User Roles
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;

CREATE POLICY "Allow all on user_roles" ON user_roles FOR ALL USING (true) WITH CHECK (true);

-- 7. Parent Requests
DROP POLICY IF EXISTS "Parents can view own requests" ON parent_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON parent_requests;
DROP POLICY IF EXISTS "Parents can insert own requests" ON parent_requests;
DROP POLICY IF EXISTS "Admins can insert requests" ON parent_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON parent_requests;

CREATE POLICY "Allow all on parent_requests" ON parent_requests FOR ALL USING (true) WITH CHECK (true);

-- 8. Student Progress
DROP POLICY IF EXISTS "Admins can view all progress" ON student_progress;
DROP POLICY IF EXISTS "Teachers can view assigned students progress" ON student_progress;
DROP POLICY IF EXISTS "Parents can view children progress" ON student_progress;
DROP POLICY IF EXISTS "Teachers can insert progress for assigned students" ON student_progress;
DROP POLICY IF EXISTS "Teachers can update progress for assigned students" ON student_progress;
DROP POLICY IF EXISTS "Admins can insert progress" ON student_progress;
DROP POLICY IF EXISTS "Admins can update progress" ON student_progress;

CREATE POLICY "Allow all on student_progress" ON student_progress FOR ALL USING (true) WITH CHECK (true);

-- 9. Curriculum (Grades, Books, Modules, Exercises)
-- These had public read, admin write. Now allow everything.
DROP POLICY IF EXISTS "Public can view grades" ON grades;
DROP POLICY IF EXISTS "Admins can insert grades" ON grades;
DROP POLICY IF EXISTS "Admins can update grades" ON grades;
CREATE POLICY "Allow all on grades" ON grades FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view books" ON books;
DROP POLICY IF EXISTS "Admins can insert books" ON books;
DROP POLICY IF EXISTS "Admins can update books" ON books;
CREATE POLICY "Allow all on books" ON books FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view modules" ON modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON modules;
DROP POLICY IF EXISTS "Admins can update modules" ON modules;
CREATE POLICY "Allow all on modules" ON modules FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view exercises" ON exercises;
DROP POLICY IF EXISTS "Admins can insert exercises" ON exercises;
DROP POLICY IF EXISTS "Admins can update exercises" ON exercises;
CREATE POLICY "Allow all on exercises" ON exercises FOR ALL USING (true) WITH CHECK (true);
