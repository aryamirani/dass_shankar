# Developer Guide: Adding New Content

This guide provides complete instructions for adding new grades, books, modules, and exercises to the Shankar Foundation Learning Portal while ensuring automatic progress tracking, consistent navigation, and accurate test scoring.

## Table of Contents
1. [Quick Start: Adding an Exercise](#quick-start-adding-an-exercise)
2. [Component Pattern & Required Props](#component-pattern--required-props)
3. [Registering Content in LearningApp.jsx](#registering-content-in-learningappjsx)
4. [Sidebar & Navigation Rules](#sidebar--navigation-rules)
5. [Database Setup (Supabase)](#database-setup-supabase)
6. [Design & Layout Conventions](#design--layout-conventions)
7. [Adding Modules, Books, and Grades](#adding-modules-books-and-grades)

---

## Quick Start: Adding an Exercise

### 1. Create the Component
Create your React component in `src/pages/GradeX/...`.

### 2. Required Props
Your component **MUST** accept:
- `onBack`: Return to the previous view (usually the module overview).
- `onNextExercise`: Trigger completion and move to the next activity.

### 3. Implementation Pattern
```jsx
export default function MyNewExercise({ onBack, onNextExercise }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleWin = () => {
    setIsCompleted(true);
    // Success audio/animation here
  };

  return (
    <div>
      {/* Exercise content */}
      
      {isCompleted && (
        <button onClick={onNextExercise}>
          Next Exercise →
        </button>
      )}
    </div>
  );
}
```

---

## Registering Content in LearningApp.jsx

### 1. Import and Navigation
Add the import and a `goTo` function:
```javascript
import MyNewExercise from './pages/GradeX/my-path/MyNewExercise';

function goToMyNewExercise() { setView({ name: 'myNewExercise' }) }
```

### 2. The Route Wrapper
Use `NavigationWrapper` to ensure consistent header behavior. The `handleComplete` function is the main bridge to the database:

```jsx
{view.name === 'myNewExercise' && (
  <NavigationWrapper onBack={goHome}>
    <MyNewExercise 
      onBack={goHome} 
      onNextExercise={(score = 100, metadata = {}) => { 
        // 1. Saves to Supabase 'student_progress'
        // 2. Updates local 'completed' state for ticks
        handleComplete('my-new-slug', score, metadata); 
        
        goToNextView(); 
      }} 
    />
  </NavigationWrapper>
)}
```

#### handleComplete Parameters:
- **slug** (String): Must match the database entry.
- **score** (Number): Optional. Defaults to 100.
- **metadata** (Object): Optional. Useful for storing quiz answers or specific test results (e.g., `{ mode: 'test', attempts: 1 }`).

> [!IMPORTANT]
> **Test Mode Scoring**: Whenever you add a new activity, you **MUST** update the `totalExpectedCount` in `LearningApp.jsx` (around line 350) for the correct grade percentage calculation.

---

## Sidebar & Navigation Rules

### Sidebar Setup
Add your exercise to `src/components/Sidebar.jsx` in the `MENU_STRUCTURE`.
- **Ticks**: Folders only show a green tick if they have children and all are completed. Empty folders stay unticked.
- **Submenus**: For modules with many small tasks (e.g., phonics games), use a **two-column grid** for sub-buttons to save vertical space.

### Navigation Flow
- **Back Buttons**: Ensure `onBack` in overviews points to the grade-specific Book Overview (using `goHome()`) to prevent students from hitting the manual grade selection screen.

---

## Database Setup (Supabase)

Every exercise needs a row in the `exercises` table:
```sql
INSERT INTO exercises (module_id, name, slug, sort_order)
VALUES ('module-uuid', 'My New Game', 'my-new-slug', 10);
```

> [!CAUTION]
> The `slug` in the database **MUST EXACTLY MATCH** the string passed to `handleComplete('slug')` in the code.

---

## Design & Layout Conventions

### 1. Module Overviews (Grid Layout)
Use the standard grid for module activity landing pages:
- **Desktop**: 3 icons per row (`grid-template-columns: repeat(3, 1fr)`).
- **Tablet**: 2 icons per row.
- **Mobile**: 1 icon per row.
- **Styling**: `border-radius: 30px`, `box-shadow`, and `centered` titles.

---

## Adding Modules, Books, and Grades

For structural changes (new subjects/books), follow the detailed SQL insertion steps and sidebar expansion logic documented in the project logs, ensuring all UUIDs are unique and sort orders are sequential.

---

## Verification Checklist
- [x] Back button stays within the Grade Book overview.
- [x] "Next Exercise" button appears only after finishing.
- [x] `totalExpectedCount` updated in `LearningApp.jsx`.
- [x] Database slug matches code slug.
- [x] Ticks are visible in both Learn and Test modes.
