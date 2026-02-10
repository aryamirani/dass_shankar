# How to Add New Content - Complete Guide

This guide explains how to add new grades, books, modules, and exercises to the educational platform.

## Table of Contents
1. [Adding a New Exercise](#adding-a-new-exercise)
2. [Adding a New Module](#adding-a-new-module)
3. [Adding a New Book](#adding-a-new-book)
4. [Adding a New Grade](#adding-a-new-grade)
5. [Running SQL in Supabase](#running-sql-in-supabase)
6. [Frontend Development Workflow](#frontend-development-workflow)

---

## Adding a New Exercise

An exercise is an individual activity within a module (e.g., "Counting" in the Maths Module).

### Backend (Supabase SQL Editor)

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this SQL** (replace the values with your exercise details):

```sql
-- Get the module ID first
SELECT id, name FROM modules WHERE slug = 'maths'; -- Replace 'maths' with your module slug

-- Insert the new exercise
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
(
    '10000000-0000-0000-0000-000000000002', -- Replace with actual module_id from above query
    'Division Practice',                      -- Exercise name (displayed to users)
    'mathsExerciseTen',                      -- Unique slug (used in code)
    'Learn division operations',             -- Description
    'interactive',                           -- Type: 'interactive', 'game', 'quiz', 'assessment'
    10                                       -- Sort order (determines display order)
);
```

3. **Verify** the exercise was added:
```sql
SELECT e.name, e.slug, m.name as module_name 
FROM exercises e 
JOIN modules m ON e.module_id = m.id 
WHERE e.slug = 'mathsExerciseTen';
```

### Frontend (React Code)

#### Step 1: Create the Exercise Component

Create a new file: `src/pages/GradeX/maths/MathsExerciseTen.jsx`

```javascript
import React from 'react'

export default function MathsExerciseTen({ onBack, onNext }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px'
    }}>
      <h1>Division Practice</h1>
      {/* Your exercise content here */}
      
      <button onClick={onNext}>Complete & Next</button>
    </div>
  )
}
```

#### Step 2: Add Import to App.jsx

In `src/App.jsx`, add the import at the top:

```javascript
import MathsExerciseTen from './pages/GradeX/maths/MathsExerciseTen'
```

#### Step 3: Add Navigation Function

In `src/App.jsx`, add the navigation function (around line 180):

```javascript
function goToMathsExerciseTen() { setView({ name: 'mathsExerciseTen' }) }
```

#### Step 4: Add Route Rendering

In `src/App.jsx`, add the route (around line 450, after MathsExerciseNine):

```javascript
{view.name === 'mathsExerciseTen' && (
  <NavigationWrapper 
    onBack={() => setView({ name: 'mathsExerciseNine' })} 
    onNext={() => { markCompleted('mathsExerciseTen'); goToComputerOverview() }}
  >
    <MathsExerciseTen 
      onBack={() => setView({ name: 'mathsExerciseNine' })} 
      onComplete={() => markCompleted('mathsExerciseTen')} 
      onNext={() => { markCompleted('mathsExerciseTen'); goToComputerOverview() }} 
    />
  </NavigationWrapper>
)}
```

#### Step 5: Add to Sidebar

In `src/components/Sidebar.jsx`, find the Maths Module children array and add:

```javascript
{ id: 'mathsExerciseTen', label: 'Division', type: 'file', icon: '➗' }
```

#### Step 6: Test

1. Run `npm run dev`
2. Navigate to the Maths Module in the sidebar
3. Click on "Division" to test your new exercise

---

## Adding a New Module

A module is a collection of exercises (e.g., "Arts Module" with drawing, painting exercises).

### Backend (Supabase SQL Editor)

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Get the Book ID**:

```sql
SELECT b.id, b.name, g.display_name as grade 
FROM books b 
JOIN grades g ON b.grade_id = g.id 
WHERE b.code = 'A' AND g.name = 'grade_1';
```

3. **Insert the New Module**:

```sql
INSERT INTO modules (id, book_id, name, slug, description, icon, color, sort_order) VALUES
(
    '10000000-0000-0000-0000-000000000006', -- Generate a new UUID
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- book_id from above query
    'Music Module',                          -- Module name
    'music',                                 -- Unique slug
    'Learn music and rhythm',                -- Description
    '🎵',                                    -- Icon (emoji)
    '#9c27b0',                              -- Color (hex code)
    6                                        -- Sort order
);
```

4. **Verify**:
```sql
SELECT m.name, m.slug, b.name as book_name 
FROM modules m 
JOIN books b ON m.book_id = b.id 
WHERE m.slug = 'music';
```

### Frontend (React Code)

#### Step 1: Create Module Overview Page

Create `src/pages/GradeX/music/MusicOverview.jsx`:

```javascript
import React from 'react'

export default function MusicOverview({ onStart, onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎵</div>
      <h1 style={{ fontSize: '48px', color: 'white', marginBottom: '20px' }}>
        Music Module
      </h1>
      <p style={{ fontSize: '24px', color: 'white', marginBottom: '40px' }}>
        Learn music and rhythm
      </p>
      <button onClick={onStart} style={{
        padding: '20px 40px',
        fontSize: '24px',
        background: 'white',
        color: '#9c27b0',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer'
      }}>
        Start Learning
      </button>
    </div>
  )
}
```

#### Step 2: Add to App.jsx

**Import**:
```javascript
import MusicOverview from './pages/GradeX/music/MusicOverview'
```

**Navigation function**:
```javascript
function goToMusicOverview() { setView({ name: 'music' }) }
```

**Route**:
```javascript
{view.name === 'music' && <MusicOverview onStart={goToMusicExerciseOne} onBack={goHome} />}
```

**Sidebar handler** (in `handleSidebarNav`):
```javascript
else if (viewId === 'music') setView({ name: 'music' })
```

#### Step 3: Add to Sidebar Menu

In `src/components/Sidebar.jsx`, find the `book-a-grade-x` children array and add:

```javascript
{
    id: 'music', 
    label: 'Music Module', 
    type: 'folder', 
    icon: '🎵', 
    children: [
        // Add exercises here later
    ]
}
```

#### Step 4: Update Sidebar State

In `src/components/Sidebar.jsx`:

**Add to `getActiveFolderId` function**:
```javascript
if (currentView === 'music' || currentView.startsWith('musicExercise')) return 'music'
```

**Add to `expanded` state**:
```javascript
'music': activeFolderId === 'music'
```

**Add to book folder check**:
```javascript
'book-a-grade-x': activeFolderId && ['vocabulary', 'maths', 'computer', 'evs', 'arts', 'music'].includes(activeFolderId)
```

**Add to `isActive` check**:
```javascript
(item.id === 'music' && currentView.startsWith('music'))
```

---

## Adding a New Book

A book contains multiple modules (e.g., "Book E" for Grade 1).

### Backend (Supabase SQL Editor)

1. **Get the Grade ID**:
```sql
SELECT id, display_name FROM grades WHERE name = 'grade_1';
```

2. **Insert the New Book**:
```sql
INSERT INTO books (id, grade_id, code, name, description, is_active, sort_order) VALUES
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', -- Use the UUID from seed data or generate new
    '11111111-1111-1111-1111-111111111111', -- grade_id from above
    'E',                                     -- Book code
    'Book E',                                -- Book name
    'Second book of Grade 1 curriculum',     -- Description
    TRUE,                                    -- Set to TRUE to activate
    2                                        -- Sort order
);
```

3. **Verify**:
```sql
SELECT b.name, b.code, g.display_name as grade 
FROM books b 
JOIN grades g ON b.grade_id = g.id 
WHERE b.code = 'E';
```

### Frontend (React Code)

#### Add to Sidebar

In `src/components/Sidebar.jsx`, add after `book-a-grade-x`:

```javascript
{
    id: 'book-e-grade-x', 
    label: 'Book E', 
    type: 'folder', 
    icon: '📖', 
    children: [
        // Add modules here
    ]
}
```

Update the `expanded` state to include `'book-e-grade-x': false`

---

## Adding a New Grade

A grade contains multiple books (e.g., "Grade 13").

### Backend (Supabase SQL Editor)

1. **Insert the New Grade**:
```sql
INSERT INTO grades (id, name, display_name, description, sort_order) VALUES
(
    '33333333-3333-3333-3333-333333333333', -- Generate new UUID
    'grade_13',                              -- Internal name (lowercase, underscores)
    'Grade 13',                              -- Display name
    'Advanced grade level',                  -- Description
    3                                        -- Sort order
);
```

2. **Add Books for the Grade**:
```sql
INSERT INTO books (id, grade_id, code, name, description, is_active, sort_order) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'A', 'Book A', 'First book of Grade 13', TRUE, 1);
```

### Frontend (React Code)

#### Add to Sidebar

In `src/components/Sidebar.jsx`, add after Grade 2:

```javascript
{ id: 'landing3', label: 'Grade 13', type: 'file', icon: '🏠' },
{
    id: 'book-a-grade-x3', 
    label: 'Book A', 
    type: 'folder', 
    icon: '📖', 
    children: [
        // Add modules here
    ]
}
```

---

## Running SQL in Supabase

### Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Sign in to your account
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" button

3. **Paste Your SQL**
   - Copy the SQL code from this guide
   - Paste it into the editor
   - **IMPORTANT**: Replace placeholder values (UUIDs, names, etc.) with your actual values

4. **Run the Query**
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - Check for success message or errors

5. **Verify Changes**
   - Run the verification query provided
   - Check the "Table Editor" to visually confirm

### Common SQL Patterns

**Get a UUID**:
```sql
SELECT uuid_generate_v4();
```

**View all modules**:
```sql
SELECT m.name, m.slug, b.name as book, g.display_name as grade
FROM modules m
JOIN books b ON m.book_id = b.id
JOIN grades g ON b.grade_id = g.id
ORDER BY g.sort_order, b.sort_order, m.sort_order;
```

**View all exercises in a module**:
```sql
SELECT e.name, e.slug, e.type, m.name as module
FROM exercises e
JOIN modules m ON e.module_id = m.id
WHERE m.slug = 'maths'
ORDER BY e.sort_order;
```

---

## Frontend Development Workflow

### Running the Development Server

```bash
# Navigate to project directory
cd /Users/aryamirani/Desktop/iiit/sem4/dass/project/project-monorepo-team-20

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:5173`

### File Structure

```
src/
├── pages/
│   ├── GradeX/
│   │   ├── english/      # English module exercises
│   │   ├── maths/        # Maths module exercises
│   │   ├── computer/     # Computer module exercises
│   │   ├── evs/          # EVS module exercises
│   │   └── arts/         # Arts module exercises
│   └── GradeX2/
│       ├── health/       # Health module exercises
│       ├── english/      # English module exercises
│       └── science/      # Science module exercises
├── components/
│   └── Sidebar.jsx       # Navigation sidebar
├── App.jsx               # Main app with routing
└── main.jsx              # Entry point
```

### Making Changes

1. **Edit files** in your code editor
2. **Save** - the dev server will auto-reload
3. **Check browser** for changes
4. **Fix any errors** shown in terminal or browser console

### Common Issues

**Port already in use**:
```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Module not found**:
- Check import paths are correct
- Ensure file exists at the specified path
- Restart dev server

**Changes not showing**:
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Clear browser cache
- Restart dev server

---

## Quick Reference Checklist

### Adding an Exercise
- [ ] Run SQL to insert exercise in Supabase
- [ ] Create exercise component file
- [ ] Add import to App.jsx
- [ ] Add navigation function to App.jsx
- [ ] Add route rendering to App.jsx
- [ ] Add to sidebar menu in Sidebar.jsx
- [ ] Test in browser

### Adding a Module
- [ ] Run SQL to insert module in Supabase
- [ ] Create module overview component
- [ ] Create module folder with exercises
- [ ] Add imports to App.jsx
- [ ] Add navigation functions to App.jsx
- [ ] Add routes to App.jsx
- [ ] Add to sidebar menu in Sidebar.jsx
- [ ] Update sidebar state management
- [ ] Test in browser

### Adding a Book
- [ ] Run SQL to insert book in Supabase
- [ ] Add book folder to sidebar menu
- [ ] Add modules under the book
- [ ] Update sidebar state
- [ ] Test in browser

### Adding a Grade
- [ ] Run SQL to insert grade in Supabase
- [ ] Run SQL to insert books for the grade
- [ ] Add grade section to sidebar
- [ ] Add books and modules
- [ ] Test in browser

---

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Check existing code** for examples of similar components
