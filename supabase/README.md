# Supabase Backend Integration - SQL Files

This folder contains all SQL files that need to be run in the Supabase SQL Editor.

## Setup Instructions

### Step 1: Run SQL Files in Order

Go to your Supabase project dashboard → SQL Editor, and run these files **in order**:

1. **01_auth_schema.sql** - Creates authentication and user management tables
2. **02_curriculum_schema.sql** - Creates grade/book/module/exercise structure
3. **03_progress_schema.sql** - Creates student progress tracking tables
4. **04_rls_policies.sql** - Sets up Row Level Security policies
5. **05_seed_data.sql** - Populates initial curriculum data

### Step 2: Create Your First Admin User

After running all SQL files:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter email and password for your admin account
4. Copy the User ID (UUID) that was created
5. Go back to **SQL Editor** and run:

```sql
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from step 4
INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_ID_HERE', 'admin');
```

### Step 3: Verify Setup

Run this query in SQL Editor to verify everything is set up correctly:

```sql
SELECT 
    g.display_name AS grade,
    b.name AS book,
    m.name AS module,
    COUNT(e.id) AS exercise_count
FROM grades g
JOIN books b ON g.id = b.grade_id
JOIN modules m ON b.id = m.book_id
LEFT JOIN exercises e ON m.id = e.module_id
GROUP BY g.display_name, g.sort_order, b.name, b.sort_order, m.name, m.sort_order
ORDER BY g.sort_order, b.sort_order, m.sort_order;
```

You should see:
- Grade 1 → Book A → 4 modules (English: 14 exercises, Maths: 9 exercises, Computer: 1 exercise, EVS: 5 exercises)
- Grade 2 → Book A → 3 modules (Health: 2 exercises, English: 3 exercises, Science: 1 exercise)

## Database Structure Overview

### Authentication Tables
- `teachers` - Teacher accounts
- `parents` - Parent accounts
- `students` - Student records (no login)
- `teacher_students` - Teacher-student assignments
- `parent_students` - Parent-child relationships
- `user_roles` - Role mapping (admin/teacher/parent)

### Curriculum Tables
- `grades` - Grade levels (Grade 1, Grade 2)
- `books` - Books within grades (A, E, I, O, U)
- `modules` - Learning modules (English, Maths, etc.)
- `exercises` - Individual exercises

### Progress Tracking
- `student_progress` - Tracks completion and scores

## Row Level Security (RLS)

The database has comprehensive RLS policies:

- **Admins**: Can see and manage everything
- **Teachers**: Can only see/manage their assigned students
- **Parents**: Can only see their own children's progress
- **Curriculum**: Public read access, admin-only write access

## Helper Functions

The database includes helper functions for calculating progress:

- `get_module_progress(student_id, module_id)` - Returns completion % for a module
- `get_book_progress(student_id, book_id)` - Returns completion % for a book
- `get_student_overall_progress(student_id)` - Returns overall completion %

## Next Steps

After setting up the database:

1. Install Supabase client in your frontend: `npm install @supabase/supabase-js`
2. Configure environment variables with your Supabase URL and anon key
3. Implement authentication flows
4. Build role-based dashboards
5. Integrate progress tracking into existing exercises
